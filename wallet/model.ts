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

  // method to trigger ui updates as it is used as a hook
  onUpdate: (() => void) | null = null;

  constructor(
    scan: ec.KeyPair,
    spend: ec.KeyPair,
    mnemonic: string,
    utxos = [],
    lastHeight = 0,
    mainnet: boolean = false,
  ) {
    this.mnemonic = mnemonic; // seed phrase in order to show it to the user in settings
    this.scanSecretKey = scan;
    this.spendSecretKey = spend;
    this.address = encodeSilentPaymentAddress(scan, spend, mainnet ? 'sp' : 'tsp' , 0); // todo needs to be changed for production
    this.utxos = utxos;
    this.lastHeight = lastHeight;
  }

  /**
   * setUtxos
   */
  public setUtxos(utxos: Utxo[]) {
    if (!utxos) return
    this.utxos = utxos
    this.onUpdate && this.onUpdate();  // Notify about the change
  }

  /**
   * setLastHeight
   */
  public setLastHeight(height: number) {
    this.lastHeight = height
    this.onUpdate && this.onUpdate();  // Notify about the change
  }

  /**
   * balance
   * different states can be given for the filter. Default only unspent coins are counted
   */
  public balance(states: utxoState[] = ['unspent']): number {
    const filteredUtxos = this.filterUtxos(states);
    return filteredUtxos.reduce((accumulator, utxo) => accumulator + utxo.amount, 0);
  }

  filterUtxos(states: utxoState[]): Utxo[] {
    return this.utxos.filter(utxo => {
      if (states.indexOf(utxo.utxo_state) > -1) return utxo
    })
  }
}

