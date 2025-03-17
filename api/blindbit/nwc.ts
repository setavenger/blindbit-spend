import { webln } from "@getalby/sdk";
import { Utxo } from "@/api";
import { Nip47GetInfoResponse } from "@getalby/sdk/dist/NWCClient";

export class BlindBitNwcService {
  weblnProvider: webln.NostrWebLNProvider;

  constructor(nwcUri: string) {
    this.weblnProvider = new webln.NostrWebLNProvider({
      nostrWalletConnectUrl: nwcUri,
    });
  }

  async enableWeblnProvider() {
    await this.weblnProvider.enable();
  }

  async getUtxos(): Promise<Utxo[]> {
    const utxos = await this.weblnProvider.listUtxos()
    return utxos.utxos
  }

  async getInfo(): Promise<Nip47GetInfoResponse> {
    const info = await this.weblnProvider.getInfoBlindBit()
    return info
  }
}
