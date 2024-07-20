
export type UtxosResponse = Utxo[]

export type HeightResponse = {
  height: number
}

export interface Utxo {
  txid: string
  vout: number
  amount: number
  priv_key_tweak: string
  pub_key: string
  timestamp: number
  utxo_state: number
  label: Label
}

export interface Label {}
