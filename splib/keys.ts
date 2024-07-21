import {BIP32Factory} from 'bip32';

import elliptic from 'elliptic';
import ecc from '../extra_modules/noble_ecc';

// const bitcoin = require('bitcoinjs-lib');
let Buffer = require('buffer/').Buffer;

// bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);
const secp256k1 = new elliptic.ec('secp256k1');

export function deriveSilentPaymentKeyPair(seed: Buffer) {
  // Generate a random key pair from seed
  const scan_key = "m/352'/0'/0'/1'/0";
  const spend_key = "m/352'/0'/0'/0'/0";
  const master = bip32.fromSeed(seed);

  const scanSecretKey = master.derivePath(scan_key).privateKey;
  if (!scanSecretKey) throw new Error('scan key derivation error')
  const keyPairScan = secp256k1.keyFromPrivate(scanSecretKey);

  const spendSecretKey = master.derivePath(spend_key).privateKey;
  if (!spendSecretKey) throw new Error('spend key derivation error')
  const keyPairSpend = secp256k1.keyFromPrivate(spendSecretKey);

  return {
    scan: keyPairScan,
    spend: keyPairSpend,
  };
}

