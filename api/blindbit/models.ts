
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
  utxo_state: utxoState
  label: Label
}

export type utxoState = 'unconfirmed' | 'unspent' | 'spent' | 'unconfirmed_spent'

export interface Label {
  pub_key: string
  tweak: string
  address: string
  m: number
}
