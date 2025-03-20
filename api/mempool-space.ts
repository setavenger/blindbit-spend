import { network } from '@/wallet';

// const MempoolApiMain = "https://mempool.space/api"
// const MempoolApiSignet = "https://mempool.space/signet/api"
// const MempoolApitestnet = "https://mempool.space/testnet/api"

const MempoolClearnetAddress = "https://mempool.space"

// todo: enable broadcast through electrum/blindbit scan as a proxy
//
export async function broadcastTxToMempoolSpace(txHex: string, network: network): Promise<string> {
  const baseUrl = MempoolClearnetAddress;

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
  } catch (error) {
    console.error('API call failed:', error);
    throw error
  }
}


