import { createContext, useContext, useState } from 'react';
import * as bitcoin from '../extra_modules/bitcoinjs-lib/src';

export function useSendContext(): SendContextType {
  const context = useContext(SendContext)
  if (!context) {
    throw new Error("component has to be within SendContext")
  }
  return context
}

type SendContextType = {
  psbt: bitcoin.Psbt | null;
  updatePsbt: (psbt: bitcoin.Psbt) => void;
}
 
const SendContext = createContext<SendContextType | null>(null);

export function SendContextProvider({ children }: { children: React.ReactNode }) {
  const [psbt, setPsbt] = useState<bitcoin.Psbt | null>(null)

  const updatePsbt = (psbt: bitcoin.Psbt) => {
    setPsbt(psbt)
  }

  return (
    <SendContext.Provider 
      value={{ 
        psbt,
        updatePsbt,
      }}>
      {children}
    </SendContext.Provider>
  )
}

