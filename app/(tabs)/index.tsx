import { Button, StyleSheet, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { MarginThemedView } from '@/components/MarginThemedView';
import { useAppContext } from '@/context';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { blindbitApiService, wallet, updateWallet } = useAppContext()
  const [syncHeight, setSyncHeight] = useState(0);

  // load Data
  useEffect(() => {
    refreshWallet()
  }, [syncHeight]);

  const refreshWallet = () => {
    if (blindbitApiService == null) {
      // console.warn("blindbitApiService is null");
      return;
    };

    console.log(blindbitApiService);
    blindbitApiService.fetchHeight()
    .then(resp => {
      setSyncHeight(resp.height);
    })
    .catch(error => {
      console.error(error);
      throw error;
    });

    blindbitApiService.fetchUtxos()
    .then(resp => {
      if (!wallet) { console.log("wallet was null"); return };
      wallet.setUtxos(resp);
      updateWallet(wallet);
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
  }

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
          <TouchableOpacity
            onPress={()=> {refreshWallet()}}
          >
            <Ionicons size={28} name={'refresh'}/>
          </TouchableOpacity>
        </ThemedView>
        {!wallet.mainnet && <ThemedView style={styles.testnetWarning}><ThemedText style={styles.testnetWarning}>{wallet.networkType}</ThemedText></ThemedView>}
        <ThemedView style={styles.body}>
          <ThemedText type='title'>{wallet && wallet.balance().toLocaleString()} Sats</ThemedText>
          {blindbitApiService == null ? <NoBlindBitBackendConfigured/> : null}
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
  safeArea: {
    flex: 1, 
    backgroundColor: 'transparent'
  },
  container: {
    flex: 1,
  },
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
