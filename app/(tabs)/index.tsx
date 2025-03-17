import { Button, StyleSheet, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { MarginThemedView } from '@/components/MarginThemedView';
import { useAppContext } from '@/context';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { webln } from "@getalby/sdk";

// 1 sat test connection
// const nwcUrl = "nostr+walletconnect://4962101b88d1401bb7b4126adebe59fdd1a6ee0cfd69704b8d7147e68511ed0c?relay=wss://relay.getalby.com/v1&secret=12b5d348f4e40d8c89785f502358ed36ee0affea25debbeaaecf379d50cb332f&lud16=setor@getalby.com"

// const nwcUrl = "nostr+walletconnect://3e6221b76a6555c819c8d0c87d9af47ce1b31c0b413f276b2f0d8ddd2a3e1c1f?relay=wss://relay.getalby.com/v1&secret=125b81e4b8b21c889374ebf1a4b786791f0088a4f3b64260e75fd759497c2700"

// const nwcUrl = "nostr+walletconnect://55a0637072b8edeed0b1e8409a8a212d9f80ad097b878a221cb7f1f7f3914a0f?relay=wss://relay.getalby.com/v1\u0026secret=14d97086554a4bb2b7cd7bec78d1786602823e7dc842f435f57ca5cab7043e71"

const nwcUrl = "nostr+walletconnect://bd01936dbeb189f972dc9ed832fe8f7c6c06c53ac3368a7f55796348cc85c327?relay=wss://relay.getalby.com/v1\u0026secret=3841e3cbc20f17481361605fd29fb57aeb20424a240f234e1a8821b5f10955e7"

export default function HomeScreen() {
  const { blindbitNwcService, wallet, updateWallet } = useAppContext()
  const [syncHeight, setSyncHeight] = useState(0);
  const [syncState, setSyncState] = useState<syncState>("nothing")
  const [error, setError] = useState<any>(null)
  const [nostrWebLN, setNostrWebLN] = useState<
    webln.NostrWebLNProvider | undefined
  >(undefined);
  type syncState = "nothing" | "fetching" | "failed"

  const refreshWallet = async () => {
    if (!blindbitNwcService) return;
    setError(null); // reset before api calls
    setSyncState("fetching")

    try {
      const info = await blindbitNwcService.getInfo();
      setSyncHeight(info.block_height);
      if (!wallet) {
        console.log("wallet was null");
        return
      };
      const utxos = await blindbitNwcService.getUtxos()
      wallet.setUtxos(utxos);
      updateWallet(wallet);
    } catch (error) {
      setSyncState("failed")
      console.error(error);
      setError(error)
      throw error;
    }
    setSyncState("nothing")
  }

  // const refreshWallet = async () => {
  //   setError(null); // reset before api calls
  //   setSyncState("fetching")
  //
  //   await getNwcInfo();
  //   if (blindbitApiService == null) {
  //     console.warn("blindbitApiService is null");
  //     setSyncState("failed")
  //     setError("no service given")
  //     return;
  //   };
  //
  //   try {
  //     const height = await blindbitApiService.fetchHeight()
  //     setSyncHeight(height)
  //     if (!wallet) {
  //       console.log("wallet was null");
  //       return
  //     };
  //     const utxos = await blindbitApiService.fetchUtxos()
  //     wallet.setUtxos(utxos);
  //     updateWallet(wallet);
  //   } catch (error) {
  //     setSyncState("failed")
  //     console.error(error);
  //     setError(error)
  //     throw error;
  //   }
  //   setSyncState("nothing")
  // }

  // load Data
  useEffect(() => {
    if (!blindbitNwcService) return;
    refreshWallet()
  }, [blindbitNwcService]);

  useEffect(() => {
    (async () => {
      try {
        const _nostrWebLN = new webln.NostrWebLNProvider({
          nostrWalletConnectUrl: nwcUrl,
        });
        await _nostrWebLN.enable();
        setNostrWebLN(_nostrWebLN);
      } catch (error) {
        console.error("failed balance request", error);
      }
    })();
  }, [])

  if (!wallet) {
    return (
      <MarginThemedView>
        <ThemedText type='title'>Wallet not setup</ThemedText>
      </MarginThemedView>
    )
  };

  return (
    <MarginThemedView>
      <ThemedView style={styles.topBar}>
        <ThemedText>Height: {syncHeight.toLocaleString()}</ThemedText>
        <ThemedView>
          <TouchableOpacity onPress={() => { refreshWallet() }}>
            <Ionicons
              size={28}
              name={'refresh'}
              color={useThemeColor({ light: "", dark: "" }, "text")}
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      <ThemedView style={{ flexDirection: 'row-reverse', width: '100%' }}>
        <ThemedText type='default'>{syncState === 'nothing' ? ' ' : syncState}</ThemedText>
      </ThemedView>
      {!wallet.mainnet && (
        <ThemedView style={styles.testnetWarning}>
          <ThemedText style={styles.testnetWarning}>
            {wallet.networkType}
          </ThemedText>
        </ThemedView>
      )}
      {
        <ThemedView style={styles.testnetWarning}>
          <ThemedText style={{ color: 'red' }}>
            {`${error || ""}`}
          </ThemedText>
        </ThemedView>
      }
      <ThemedView style={styles.body}>
        <ThemedText type='title'>{wallet && wallet.balance().toLocaleString()} Sats</ThemedText>
        {blindbitNwcService == null ? <NoBlindBitBackendConfigured /> : null}
        <ThemedText type='link' onPress={() => router.push('/utxos')}>View Coins</ThemedText>
      </ThemedView>
    </MarginThemedView>
  );
}


function NoBlindBitBackendConfigured() {
  return (
    <ThemedView style={{ alignItems: 'center' }}>
      <ThemedText type='defaultSemiBold' style={{ color: 'red' }}>No backend configured</ThemedText>
      <ThemedText type='link' onPress={() => router.push('/settings')}>Settings</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testnetWarning: {
    alignItems: 'center',
    color: 'red'
  }
});
