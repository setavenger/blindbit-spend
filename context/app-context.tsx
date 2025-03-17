import { BlindBitAPIService } from "@/api/blindbit";
import { Wallet } from "@/wallet";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BlindBitApiSettings, deleteWalletFromDisk, loadBlindBitApiSettings, loadBlindBitNwcSettings, loadWalletFromDisk, saveBlindBitApiSettings, saveBlindBitNwcUri, saveWalletToDisk } from "./storage";
import { router } from "expo-router";
import { BlindBitNwcService } from "@/api/blindbit/nwc";

export function useAppContext(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("component has to be within AppContext")
  }
  return context
}

type AppStates = "Loading" | "Loaded" | "New"

type AppContextType = {
  blindbitApiService: BlindBitAPIService | null;
  blindbitNwcService: BlindBitNwcService | null;
  wallet: Wallet | null;
  updateWallet: (wallet: Wallet | null) => Promise<void>;
  deleteWallet: () => Promise<void>;
  appState: AppStates;
  updateBlindbitApiSettings: (settings: BlindBitApiSettings | null) => void;
  updateBlindbitNwcService: (nwcUri: string) => void;
  blindbitApiSettings: BlindBitApiSettings | null;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [appState, setAppState] = useState<AppStates>("Loading");
  const [blindbitApiService, setBlindbitApiService] = useState<BlindBitAPIService | null>(null);
  const [blindbitApiSettings, setBlindbitApiSettings] = useState<BlindBitApiSettings | null>(null);

  // nostr wallet connect
  // const [nwcUri, setNwcUri] = useState("");
  const [blindbitNwcService, setBlindbitNwcService] = useState<BlindBitNwcService | null>(null)

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
      setAppState("New")
      router.replace('/restore')
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   * will update the settings and reload the api service.
   */
  const updateBlindbitApiSettings = (settings: BlindBitApiSettings | null) => {
    if (!settings) return;
    setBlindbitApiSettings({ ...settings });
    const apiService = new BlindBitAPIService(settings.baseUrl, settings.user, settings.pass, settings.tor);
    setBlindbitApiService(apiService);
  }

  const updateBlindbitNwcService = async (nwcUri: string) => {
    if (nwcUri === "") return;
    // setNwcUri(nwcUri);
    const service = new BlindBitNwcService(nwcUri);
    await service.enableWeblnProvider()
    setBlindbitNwcService(service);
    saveBlindBitNwcUri(nwcUri);
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
          _settings = { baseUrl: "", user: "", pass: "", tor: false }
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
    (async () => {
      try {
        const nwcUri = await loadBlindBitNwcSettings();
        await updateBlindbitNwcService(nwcUri);
      } catch (error) {
        console.error(error)
        throw error
      }
    })()
  }, [])

  useEffect(() => {
    if (!blindbitApiSettings) return;
    saveBlindBitApiSettings(blindbitApiSettings);
  }, [blindbitApiSettings]);

  // useEffect(() => {
  //   if (nwcUri === "") return;
  //   saveBlindBitNwcUri(nwcUri);
  // }, [nwcUri])

  return (
    <AppContext.Provider
      value={{
        blindbitApiService,
        wallet,
        updateWallet,
        updateBlindbitApiSettings,
        updateBlindbitNwcService,
        appState,
        blindbitApiSettings,
        deleteWallet,
        blindbitNwcService,
      }}>
      {children}
    </AppContext.Provider>
  )
}

