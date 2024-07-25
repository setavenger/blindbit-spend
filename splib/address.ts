
import {bech32m} from 'bech32';
import { ec } from 'elliptic';
import ecc from '../extra_modules/noble_ecc';
import {taggedHash, ser32UintBE} from './utils'

const bitcoin = require('bitcoinjs-lib');
const {getBytes} = require('./utils');
let Buffer = require('buffer/').Buffer;

bitcoin.initEccLib(ecc);
const secp256k1 = new ec('secp256k1');

export const G = Buffer.from("0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "hex");

export function encodeSilentPaymentAddress(scan: ec.KeyPair, spend: ec.KeyPair, hrp = 'tsp', version = 0) {
  const words = bech32m.toWords(
    Buffer.concat([getBytes(scan, false), getBytes(spend, false)]),
  );
  return bech32m.encode(hrp, [version, ...words], 1023);
}

export function decodeSilentPaymentAddress(address: string, hrp: string = 'tsp') {
  const {version, data} = decode(hrp, address);
  const dataBuf = Buffer.from(data);

  const ScanPubKey = getFromPublicECKey(dataBuf.subarray(0, 33));
  const SpendPubKey = getFromPublicECKey(dataBuf.subarray(33, 66)); // according to BIP352 for v0 one is supposed to ignore everything past the first 66 bytes

  return {ScanPubKey, SpendPubKey};
}

function decode(hrp: string, addr: string): { version: number | null, data: number[] | null } {
  const decoded = bech32m.decode(addr, 1023);

  if (decoded.prefix !== hrp) {
    return {version: null, data: null};
  }

  const data = bech32m.fromWords(decoded.words.slice(1));
  if (data.length < 2) {
    return {version: null, data: null};
  }

  const version = decoded.words[0];
  if (version > 16) {
    return {version: null, data: null};
  }

  return {version, data};
}

function getFromPublicECKey(data: Buffer) {
  if (data.length === 33) {
    return secp256k1.keyFromPublic(data);
  } else if (data.length === 32) {
    // todo review what we need this branch for and whether simply prepending 0x02 is enough
    // return secp256k1.keyFromPublic(Buffer.concat([Buffer.from('02', 'hex'), data]))
    const curve = secp256k1.curve;
    const x = curve.pointFromX(data.toString('hex'), false); // Try even y
    if (curve.validate(x)) {
      return secp256k1.keyFromPublic(x);
    }

    const xOdd = curve.pointFromX(data.toString('hex'), true); // Try odd y
    if (curve.validate(xOdd)) {
      return secp256k1.keyFromPublic(xOdd);
    }

    return null; // No valid point found for the given x
  }
  else {
    return null
  }
}

export function generateLabel(scan: ec.KeyPair, m: number) {
  return taggedHash(
    'BIP0352/Label',
    Buffer.concat([
      scan.getPrivate().toArrayLike(Buffer, 'be', 32),
      ser32UintBE(m),
    ]),
  );
}

export function generateChangeLabel(scan: ec.KeyPair) {
  const label = generateLabel(scan, 0);
  const labelPubKey = ecc.pointMultiply(G, label);
  return labelPubKey as Uint8Array;
}

