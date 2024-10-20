import { BlindBitAPIService } from "@/api/blindbit";
import { Wallet } from "@/wallet";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BlindBitApiSettings, deleteWalletFromDisk, loadBlindBitApiSettings, loadWalletFromDisk, saveBlindBitApiSettings, saveWalletToDisk } from "./storage";

export function useAppContext(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("component has to be within AppContext")
  }
  return context
}

type AppStates = "Loading" | "Loaded" | "New"

type AppContextType = {
  blindbitApiService: BlindBitAPIService | null
  wallet: Wallet | null
  updateWallet: (wallet: Wallet | null) => Promise<void>;
  deleteWallet: () => Promise<void>;
  appState: AppStates
  updateBlindbitApiSettings: (settings: BlindBitApiSettings | null)=> void;
  blindbitApiSettings: BlindBitApiSettings | null
}
 
const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [appState, setAppState] = useState<AppStates>("Loading");
  const [blindbitApiService, setBlindbitApiService] = useState<BlindBitAPIService | null>(null)
  const [blindbitApiSettings, setBlindbitApiSettings] = useState<BlindBitApiSettings | null>(null)

  const updateWallet = async (newWallet: Wallet | null): Promise<void> => {
    try {
      if (newWallet == null) return;
      setWallet(newWallet.clone());
      await saveWalletToDisk(newWallet)
    } catch (error) {
     throw error 
    }
  };

  const deleteWallet = async () => {
    try {
      await deleteWalletFromDisk()
      setWallet(null)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   * will update the settings and reload the api service.
   */
  const updateBlindbitApiSettings = (settings: BlindBitApiSettings | null) => {
    if (settings == null) return;
    setBlindbitApiSettings({...settings});
    const apiService = new BlindBitAPIService(settings.baseUrl, settings.user, settings.pass);
    setBlindbitApiService(apiService);
  }

  useEffect(() => {
    try {
      loadWalletFromDisk().then(wal => {
        if (wal) {
          setWallet(wal);
          setAppState('Loaded');
          return
        } else {
          // wallet was null so we need a new wallet
          setAppState("New")
        }
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }, [wallet]);

  // load settings
  useEffect(() => {
    try {
      loadBlindBitApiSettings().then(_settings => {
        if (!_settings) {
          console.log("no blindbit-scan settings found")
          _settings = {baseUrl:"", user:"", pass:"", tor:false}
          return
        } 
        // console.debug(_settings)
        updateBlindbitApiSettings(_settings);
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }, []);


  useEffect(() => {
    if (!blindbitApiSettings) return;
    saveBlindBitApiSettings(blindbitApiSettings);
  }, [blindbitApiSettings]);

  return (
    <AppContext.Provider 
      value={{ 
        blindbitApiService, 
        wallet, 
        updateWallet, 
        updateBlindbitApiSettings, 
        appState, 
        blindbitApiSettings,
        deleteWallet,
      }}>
      {children}
    </AppContext.Provider>
  )
}

