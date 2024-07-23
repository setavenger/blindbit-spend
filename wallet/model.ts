import { Utxo, utxoState } from "@/api/blindbit";
import { encodeSilentPaymentAddress } from "@/splib";
import {ec} from 'elliptic';

export class Wallet {

  private spendSecretKey: ec.KeyPair;
  private scanSecretKey: ec.KeyPair;
  private mnemonic: string;

  utxos: Utxo[];
  address: string;
  lastHeight: number;
  mainnet: boolean = false;

  constructor(
    scan: ec.KeyPair,
    spend: ec.KeyPair,
    mnemonic: string,
    utxos: Utxo[] = [],
    lastHeight = 0,
    mainnet: boolean = false,
  ) {
    this.mnemonic = mnemonic; // seed phrase in order to show it to the user in settings
    this.scanSecretKey = scan;
    this.spendSecretKey = spend;
    this.address = encodeSilentPaymentAddress(scan, spend, mainnet ? 'sp' : 'tsp' , 0); 
    this.utxos = utxos;
    this.lastHeight = lastHeight;
  }

  /**
   * setUtxos
   */
  public setUtxos(utxos: Utxo[]) {
    if (!utxos) return
    this.utxos = utxos
  }

  /**
   * setLastHeight
   */
  public setLastHeight(height: number) {
    this.lastHeight = height
  }

  /**
   * balance
   * different states can be given for the filter. Default only unspent coins are counted
   */
  public balance(states: utxoState[] = ['unspent']): number {
    const filteredUtxos = this.filterUtxos(states);
    const sum = filteredUtxos.reduce((accumulator, utxo) => accumulator + utxo.amount, 0);
    return sum
  }

  filterUtxos(states: utxoState[]): Utxo[] {
    return this.utxos.filter(utxo => {
      if (states.indexOf(utxo.utxo_state) > -1) return utxo
    })
  }

  clone() {
    return new Wallet(this.scanSecretKey, this.spendSecretKey, this.mnemonic, this.utxos, this.lastHeight, this.mainnet);
  }
}

