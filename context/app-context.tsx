import { BlindBitAPIService } from "@/api/blindbit";
import { Wallet } from "@/wallet";
import React, { createContext, useContext, useState } from "react";


export function useAppContext(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("component has to be within AppContext")
  }

  return context
}

const blindbitApiService = new BlindBitAPIService("http://192.168.178.20:8888", "", "")
type AppContextType = {
  blindbitApiService: BlindBitAPIService
  wallet: Wallet | null
  updateWallet: (wallet: Wallet | null) => void;
}
 
const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const updateWallet = (newWallet: Wallet | null) => {
    if (newWallet == null) return;
    setWallet(newWallet.clone());
  };

  return (
    <AppContext.Provider value={{ blindbitApiService, wallet, updateWallet }}>
      {children}
    </AppContext.Provider>
  )
}
