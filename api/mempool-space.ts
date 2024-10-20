import { network } from '@/wallet';


const MempoolApiMain = "https://mempool.space/api"
const MempoolApiSignet = "https://mempool.space/signet/api"
const MempoolApitestnet = "https://mempool.space/testnet/api"

// todo: enable broadcast through electrum/blindbit scan as a proxy
//

export async function broadcastTxToMempoolSpace(txHex: string, network: network): Promise<void> {
  let baseUrl: string = "";
  if (network === 'mainnet') {
    baseUrl = MempoolApiMain
  } else if (network === 'signet') {
    baseUrl = MempoolApiSignet
  } else if (network === 'testnet') {
    baseUrl = MempoolApitestnet
  }  
  if (baseUrl === "") {
    throw Error("baseUrl still empty")
  }


  // todo: remove - dev only
  txHex = "02000000000101637667d6670cb33f3c7e9a09cfa44cb39e2c9abafb4755ecb2254b5465adac650000000000ffffffff022a16000000000000225120a1fdea0d9856aa5f54c6fc1f83ec51420404c36c13675030239e5ac3551cb6e40000000000000000076a5d04140114000140e84797523c8eb47fcf268efacfe0650e4b40cda10db2f81f305d34dfd4687e9593d9782504d66b55e5456e220d852ee525c65990b4964ac741657a0cc054fcc100000000"


  try {
    const response = await fetch(`${baseUrl}/tx`, {
      method: 'POST',
      body: txHex
    });

    if (!response.ok) {
      const respText = await response.text();
      console.log("txHex:", txHex)
      console.log(respText);
      throw new Error('Error response: ' + respText);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error
  }
}


