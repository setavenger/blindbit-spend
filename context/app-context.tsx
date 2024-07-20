import { BlindBitAPIService } from "@/api/blindbit";
import React, { createContext, useContext } from "react";


export function useAppContext(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("component has to be within AppContext")
  }

  return context
}

type AppContextType = {
  blindbitApiService: BlindBitAPIService
}
 
const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  )
}
