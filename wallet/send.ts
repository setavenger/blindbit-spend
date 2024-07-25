import { UTXOType } from "silent-payments"

let Buffer = require('buffer/').Buffer;

export interface InputUTXO {
  txid: string
  vout: number
  value: number
  privKeyTweak: Buffer
  pubKey: Buffer
  witnessUtxo: {
    script: Buffer
    value: number
  },
  // types for BlueWallet SP package
  wif: string,
  utxoType: UTXOType
}

export type Recipient = Output;

export interface Output {
  address: string
  value: number
}

function prepareTransaction() {
  
}
