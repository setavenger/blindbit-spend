import { Wallet, network } from "./model";
import * as bip39 from 'bip39';
import * as splib from '@/splib';

// let Buffer = require('buffer/').Buffer;

export async function walletFromMnemonic(mnemonic: string, _network: network) {
  if (_network === null) {
    throw new Error("no network specified")
  };
  console.debug(_network)

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const {scan, spend} = splib.deriveSilentPaymentKeyPair(seed, _network === 'mainnet');

  const wallet = new Wallet(scan, spend, mnemonic, _network);
  return wallet;
}

