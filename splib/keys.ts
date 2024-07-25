import {BIP32Factory} from 'bip32';

import elliptic from 'elliptic';
import ecc from '../extra_modules/noble_ecc';

// const bitcoin = require('bitcoinjs-lib');
let Buffer = require('buffer/').Buffer;

// bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);
const secp256k1 = new elliptic.ec('secp256k1');

export function deriveSilentPaymentKeyPair(seed: Buffer, mainnet: boolean) {
  // Generate a random key pair from seed

  let scanKey = "";
  let spendKey = "";
  if (mainnet) {
    scanKey = "m/352'/0'/0'/1'/0";
    spendKey = "m/352'/0'/0'/0'/0";
  } else {
    scanKey = "m/352'/1'/0'/1'/0";
    spendKey = "m/352'/1'/0'/0'/0";
  }
  const master = bip32.fromSeed(seed);

  const scanSecretKey = master.derivePath(scanKey).privateKey;
  if (!scanSecretKey) throw new Error('scan key derivation error')
  const keyPairScan = secp256k1.keyFromPrivate(scanSecretKey);

  const spendSecretKey = master.derivePath(spendKey).privateKey;
  if (!spendSecretKey) throw new Error('spend key derivation error')
  const keyPairSpend = secp256k1.keyFromPrivate(spendSecretKey);

  return {
    scan: keyPairScan,
    spend: keyPairSpend,
  };
}
