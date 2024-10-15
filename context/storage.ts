import { Utxo } from "@/api/blindbit";
import { Wallet, network } from "@/wallet";
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import { ec } from 'elliptic';
const secp256k1 = new ec('secp256k1');


export const StorageKeys = {
  IsTorEnabled: 'is_tor_enabled',
  Wallet: 'wallet',
  BlindBitApiSettings: 'blindbit_api_settings',
};

/**
 * this is the wallet that will be stored on disk. 
 *
 * */
export interface DiskWallet {
  scan: string
  spend: string
  mnemonic: string
  transactions: any[]
  utxos: Utxo[]
  lastHeight: number
  networkType: network
}

export const saveWalletToDisk = async (wallet: Wallet ) => {
  console.log('saving wallet data');

  // strip down wallet to save space
  let walletData: DiskWallet = {
    scan: wallet.scanSecretKey.getPrivate('hex'),
    spend: wallet.spendSecretKey.getPrivate('hex'),
    mnemonic: wallet.mnemonic,
    transactions: [],
    utxos: wallet.utxos,
    lastHeight: wallet.lastHeight,
    networkType: wallet.networkType,
  };

  await RNSecureKeyStore.set(StorageKeys.Wallet, JSON.stringify(walletData), {
    accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

/**
 * Return wallet if a wallet is found. Return null if no wallet was found.
 * All else is actual error should not necessarily lead to new wallet creation.
 */
export const loadWalletFromDisk = async (): Promise<Wallet | null> => {
  try {
    const data = await RNSecureKeyStore.get(StorageKeys.Wallet);
    const res: DiskWallet = JSON.parse(data);

    const scanKey = secp256k1.keyFromPrivate(Buffer.from(res.scan, 'hex'));
    const spendKey = secp256k1.keyFromPrivate(Buffer.from(res.spend, 'hex'));

    let newWallet = new Wallet(
      scanKey,
      spendKey,
      res.mnemonic,
      res.networkType,
      res.utxos,
      res.lastHeight,
    );
    return newWallet
  } catch (err) {
    // only log the error if it's not the standard error for not having a wallet stored
    // no logs for the startup case
    // todo maybe rethink to just know where it comes from
    if (err !== '[Error: {"message":"key does not present"}]') {
      console.log(err);
      return null
    } 
    throw err
  }
};

export const deleteWalletFromDisk = async (): Promise<void> => {
  try {
    await RNSecureKeyStore.remove(StorageKeys.Wallet)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export interface BlindBitApiSettings {
  baseUrl: string
  user: string
  pass: string
  tor: boolean
}

export async function saveBlindBitApiSettings(data: BlindBitApiSettings) {
  await RNSecureKeyStore.set(StorageKeys.BlindBitApiSettings, JSON.stringify(data), {
    accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function loadBlindBitApiSettings(): Promise<BlindBitApiSettings|null>{
  try {
    const data = await RNSecureKeyStore.get(StorageKeys.BlindBitApiSettings);
    const res: BlindBitApiSettings = JSON.parse(data);
    return res
  } catch (err) {
    // only log the error if it's not the standard error for not having a wallet stored
    // no logs for the startup case
    // todo maybe rethink to just know where it comes from
    if (err !== '[Error: {"message":"key does not present"}]') {
      console.log(err);
      return null
    } 
    throw err
  }
}

