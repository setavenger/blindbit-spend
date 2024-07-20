import { Utxo } from "@/api/blindbit";
import elliptic from 'elliptic';


export class Wallet {

  private spendSecretKey: elliptic.ec.KeyPair;
  utxos: Utxo[] = []
  
}

