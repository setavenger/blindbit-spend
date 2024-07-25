import { Wallet } from "./model";
import * as bip39 from 'bip39';
import * as splib from '@/splib';

let Buffer = require('buffer/').Buffer;

export async function walletFromMnemonic(mnemonic: string, mainnet: boolean) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const {scan, spend} = splib.deriveSilentPaymentKeyPair(seed, mainnet);

  const wallet = new Wallet(scan, spend, mnemonic, mainnet);
  return wallet
}

