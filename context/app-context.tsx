import { Wallet } from "@/wallet";
import React, { createContext, useContext, useEffect, useState } from "react";
import { deleteWalletFromDisk, loadBlindBitNwcSettings, loadWalletFromDisk, saveBlindBitNwcUri, saveWalletToDisk } from "./storage";
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
  blindbitNwcService: BlindBitNwcService | null;
  wallet: Wallet | null;
  updateWallet: (wallet: Wallet | null) => Promise<void>;
  deleteWallet: () => Promise<void>;
  appState: AppStates;
  updateBlindbitNwcService: (nwcUri: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [appState, setAppState] = useState<AppStates>("Loading");

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
   * will update the settings and reload the nwc service.
   */
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

  // useEffect(() => {
  //   if (nwcUri === "") return;
  //   saveBlindBitNwcUri(nwcUri);
  // }, [nwcUri])

  return (
    <AppContext.Provider
      value={{
        wallet,
        updateWallet,
        updateBlindbitNwcService,
        appState,
        deleteWallet,
        blindbitNwcService,
      }}>
      {children}
    </AppContext.Provider>
  )
}

