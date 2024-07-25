import { Utxo, utxoState } from "@/api/blindbit";
import { encodeSilentPaymentAddress, generateChangeLabel } from "@/splib";
import { ec } from 'elliptic';
import elliptic from 'elliptic';
import { SilentPayment } from '../extra_modules/bw_sp_module'
// import { SilentPayment } from 'silent-payments'
import { InputUTXO, Output, Recipient } from "./send";
import * as bitcoin from '../extra_modules/bitcoinjs-lib/src';
// import * as bitcoin from 'bitcoinjs-lib';
import coinselect from 'coinselect'
import ecc from '../extra_modules/noble_ecc';
import { ECPairFactory } from "ecpair";
import { getBytes } from "@/splib/utils";

const secp256k1 = new elliptic.ec('secp256k1');
const ECPair = ECPairFactory(ecc);
bitcoin.initEccLib(ecc);

let Buffer = require('buffer/').Buffer;

export class Wallet {
  // move types to ECPair seems more straightforward
  private spendSecretKey: ec.KeyPair;
  private scanSecretKey: ec.KeyPair;
  private mnemonic: string; // seed phrase in order to show it to the user in settings

  mainnet: boolean;
  utxos: Utxo[];
  address: string;
  changeAddress: string;
  lastHeight: number;

  constructor(
    scan: ec.KeyPair,
    spend: ec.KeyPair,
    mnemonic: string,
    mainnet: boolean,
    utxos: Utxo[] = [],
    lastHeight = 0,
  ) {
    this.mnemonic = mnemonic;
    this.scanSecretKey = scan;
    this.spendSecretKey = spend;
    this.mainnet = mainnet;
    this.utxos = utxos;
    this.lastHeight = lastHeight;

    // the parts that need to be computed
    // this.address = encodeSilentPaymentAddress(scan, spend, this.mainnet ? 'sp' : 'sp' , 0); // change back to tsp
    this.address = encodeSilentPaymentAddress(scan, spend, this.mainnet ? 'sp' : 'tsp' , 0);
    const changePubKeyBytes = generateChangeLabel(scan);
    const changePubKey = secp256k1.keyFromPublic(changePubKeyBytes);
    const combinedLabelKey = ecc.pointAdd(getBytes(changePubKey), getBytes(this.spendSecretKey)) as Buffer
    const labelKey = secp256k1.keyFromPublic(combinedLabelKey)
    this.changeAddress = encodeSilentPaymentAddress(scan, labelKey, this.mainnet ? 'sp' : 'tsp' , 0); // change back to tsp
    console.log("change:", this.changeAddress);
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
 
  // returns transaction hex || maybe we should return PSBT instead??
  public async makeTransaction(recipients: Recipient[], feeRate: number, states: utxoState[] = ['unspent']): Promise<string> {
    let utxos: InputUTXO[] = [];

    const spendKeyBuf = this.spendSecretKey.getPrivate().toArrayLike(Buffer, 'be', 32);

    for (const utxo of this.filterUtxos(states)) {
      // add spend key and tweak for spending
      const finalPrivKeyBuf = ecc.privateAdd(spendKeyBuf, Buffer.from(utxo.priv_key_tweak, "hex")) as Buffer
      const wif = ECPair.fromPrivateKey(Buffer.from(finalPrivKeyBuf)).toWIF()

      utxos.push({
        txid: utxo.txid,
        vout: utxo.vout,
        value: utxo.amount,
        privKeyTweak: Buffer.from(utxo.priv_key_tweak, 'hex'),
        pubKey: Buffer.from(utxo.pub_key, 'hex'),
        witnessUtxo: {
          script: Buffer.from('5120' + utxo.pub_key, 'hex'),
          value: utxo.amount,
        },
        utxoType: 'p2tr', // always p2tr
        wif: wif
      });
    }

    let targetsRaw = [];
    for (const recipient of recipients) {
      targetsRaw.push({address: recipient.address, value: recipient.value});
    }

    interface CoinSelectResult {
      inputs: InputUTXO[];
      outputs: Output[];
      fee: number;
    }
    let result: CoinSelectResult = coinselect(utxos, targetsRaw, feeRate);
    let { inputs, outputs, fee } = result;

    console.log(`fee will be ${fee} sats`);
    // todo assert fee

    if (!inputs || !outputs) throw new Error("no possible solution");   

    console.log("inputs:", inputs);
    console.log("outputs:", outputs);

    // attach change address to output without address
    outputs.forEach((out: Output) => {
      if (!out.address) {
        out.address = this.changeAddress;
      };
    });

    // route through silent payment 
    const sp = new SilentPayment();
    // const targets = sp.createTransaction(inputs, outputs, bitcoin.networks.testnet);
    const targets = sp.createTransaction(inputs, outputs,bitcoin.networks.regtest);

    console.log("targets:", targets);
    // create psbt | might need to specify network
    //make this dependant on wallet mainnet flag
    const psbt = new bitcoin.Psbt({network: bitcoin.networks.regtest});

    inputs.forEach((input) => {
      const rawKey = ECPair.fromWIF(input.wif).publicKey
      const publicKey = Buffer.from(rawKey)
      psbt.addInput({
        hash: input.txid,
        index: input.vout,
        witnessUtxo: input.witnessUtxo,
        tapInternalKey: publicKey.slice(1),
      });
    });

    targets.forEach(out => {
      if (!out.address) throw new Error("an address was missing");
      if (!out.value) throw new Error("a value was missing");
      
      console.log("new address:", out.address)
      psbt.addOutput({
        address: out.address,
        value: out.value,
      });
    });


    // sign inputs
    for (let i = 0; i < inputs.length; i++) {
      let key = ECPair.fromWIF(inputs[i].wif);
      psbt.signInput(i, key);
    }

    psbt.finalizeAllInputs();

    const txHex = psbt.extractTransaction(true).toHex();
    console.log('Transaction Hex:', txHex);

    return txHex;
  }

  // static pubkeyToAddress(hex: string): string {
  //   const publicKey = Buffer.from("5120" + hex, "hex");
  //   return bitcoin.address.fromOutputScript(publicKey, bitcoin.networks.testnet);
  // }

  clone() {
    return new Wallet(this.scanSecretKey, this.spendSecretKey, this.mnemonic, this.mainnet, this.utxos, this.lastHeight);
  }
}

