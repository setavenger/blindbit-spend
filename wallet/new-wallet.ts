// import { Wallet } from "./model";
// import * as bip39 from 'bip39';
// import * as splib from '@/splib';
//
// export async function walletFromMnemonic(mnemonic: string ) {
//   console.log(mnemonic);
//   // console.log(mnemonic);
//   const seed = await bip39.mnemonicToSeed(mnemonic);
//   console.log(seed);
//   const {scan, spend} = splib.deriveSilentPaymentKeyPair(seed);
//
//   // todo proper handling for labels insert them in scanning and create change label automatically
//
//   // return new Wallet(scan, spend, mnemonic, birthHeight, labels);
//   return new Wallet(scan, spend, mnemonic);
// }
//

// import { Wallet } from "./model";
// import * as bip39 from 'bip39';
// import * as splib from '@/splib';

export function walletFromMnemonic(mnemonic: string ): null {
  // console.log(mnemonic);
  // // console.log(mnemonic);
  // const seed = await bip39.mnemonicToSeed(mnemonic);
  // console.log(seed);
  // const {scan, spend} = splib.deriveSilentPaymentKeyPair(seed);
  //
  // // todo proper handling for labels insert them in scanning and create change label automatically
  //
  // // return new Wallet(scan, spend, mnemonic, birthHeight, labels);
  // return new Wallet(scan, spend, mnemonic);
  return null
}

