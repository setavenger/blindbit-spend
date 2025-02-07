import { network } from '@/wallet';
import Tor from "react-native-tor";
import { tor } from './blindbit';

// const MempoolApiMain = "https://mempool.space/api"
// const MempoolApiSignet = "https://mempool.space/signet/api"
// const MempoolApitestnet = "https://mempool.space/testnet/api"

const MempoolClearnetAddress = "https://mempool.space"
const MempoolOnionAddress = "http://mempoolhqx4isw62xs7abwphsq7ldayuidyx2v2oethdhhj6mlo2r6ad.onion"

// todo: enable broadcast through electrum/blindbit scan as a proxy
//
export async function broadcastTxToMempoolSpace(txHex: string, network: network, useTor: boolean = false): Promise<string> {
  let baseUrl: string = "";
  if (!useTor) {
    baseUrl = MempoolClearnetAddress;
  } else {
    baseUrl = MempoolOnionAddress;
  }
  let fullUrl: string = "";
  if (network === 'mainnet') {
    fullUrl = `${baseUrl}/api`
  } else if (network === 'signet') {
    fullUrl = `${baseUrl}/signet/api`
  } else if (network === 'testnet') {
    fullUrl = `${baseUrl}/testnet/api`
  }
  if (fullUrl === "") {
    throw Error("baseUrl still empty")
  }

  try {
    if (!tor) {
      const response = await fetch(`${fullUrl}/tx`, {
        headers: {
          'Content-Type': 'text/plain',
        },
        method: 'POST',
        body: txHex
      });

      if (!response.ok) {
        const respText = await response.text();
        console.log("txHex:", txHex)
        console.log(respText);
        throw new Error('Error response: ' + respText);
      }
      return await response.text();
    } else {
      console.log(fullUrl);
      await tor.startIfNotStarted();
      const resp = await tor.post(`${fullUrl}/tx`, txHex);

      console.log(resp);
      console.log(resp.b64Data);
      console.log(resp.json);
      console.log(resp.respCode);

      return ""
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error
  }
}


