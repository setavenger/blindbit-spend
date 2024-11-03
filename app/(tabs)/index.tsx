import { Button, StyleSheet, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { MarginThemedView } from '@/components/MarginThemedView';
import { useAppContext } from '@/context';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

type syncState = "nothing" | "fetching" | "failed"

export default function HomeScreen() {
  const { blindbitApiService, wallet, updateWallet } = useAppContext()
  const [ syncHeight, setSyncHeight ] = useState(0);
  const [ syncState, setSyncState ] = useState<syncState>("nothing")
  const [ error, setError ] = useState<any>(null)

  const refreshWallet = async () => {
    setError(null); // reset before api calls
    setSyncState("fetching")
    if (blindbitApiService == null) {
      console.warn("blindbitApiService is null");
      setSyncState("failed")
      setError("no service given")
      return;
    };

    try {
      const height = await blindbitApiService.fetchHeight()
      setSyncHeight(height)
      if (!wallet) { 
        console.log("wallet was null"); 
        return 
      };
      const utxos = await blindbitApiService.fetchUtxos()
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

  // load Data
  useEffect(() => {
    if (!blindbitApiService) return;
    refreshWallet()
  }, [blindbitApiService]);


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
            <TouchableOpacity onPress={()=> {refreshWallet()}}>
              <Ionicons 
                size={28} 
                name={'refresh'}
                color={useThemeColor({light: "", dark: ""}, "text")}
              />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        <ThemedView style={{flexDirection: 'row-reverse', width: '100%'}}>
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
            <ThemedText style={{color: 'red'}}>
              {`${error || ""}`}
            </ThemedText>
          </ThemedView>
        }
        <ThemedView style={styles.body}>
          <ThemedText type='title'>{wallet && wallet.balance().toLocaleString()} Sats</ThemedText>
          {blindbitApiService == null ? <NoBlindBitBackendConfigured/> : null}
          <ThemedText type='link' onPress={() => router.push('/utxos')}>View Coins</ThemedText>
        </ThemedView>
      </MarginThemedView>
  );
}


function NoBlindBitBackendConfigured() {
  return (
    <ThemedView style={{alignItems: 'center'}}>
      <ThemedText type='defaultSemiBold' style={{color: 'red'}}>No backend configured</ThemedText>
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
