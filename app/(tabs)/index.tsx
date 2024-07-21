import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { MarginThemedView } from '@/components/MarginThemedView';
import { useAppContext } from '@/context';

export default function HomeScreen() {
  const { blindbitApiService, wallet, updateWallet } = useAppContext()
  // define states
  const [syncHeight, setSyncHeight] = useState(853351);

  // load Data
  useEffect(() => {
   blindbitApiService.fetchHeight()
   .then(resp => {
     setSyncHeight(resp.height)
    })
   .catch(error => {
     console.error(error)
     throw error
    });

   blindbitApiService.fetchUtxos()
   .then(resp => {
     if (!wallet) return
     wallet.setUtxos(resp)
     updateWallet(wallet)
    })
   .catch(error => {
     console.error(error)
     throw error
    });

  }, [wallet]);


  return (
      <MarginThemedView>
        <ThemedView style={styles.topBar}>
          <ThemedText>Height: {syncHeight.toLocaleString()}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.body}>
          <ThemedText>Body Text </ThemedText>
          <ThemedText>{wallet && wallet.balance().toLocaleString()}</ThemedText>
          <ThemedText>Body Text </ThemedText>
          <ThemedText>Body Text </ThemedText>
          <ThemedText>Body Text </ThemedText>
          <ThemedText>Body Text </ThemedText>
        </ThemedView>
      </MarginThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, 
    backgroundColor: 'transparent'
  },
  container: {
    flex: 1,
    // flexDirection: 'column',
    // paddingHorizontal: 10,
    // justifyContent: 'space-between'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    flexDirection: 'column',
    // paddingHorizontal: 20,
    // alignItems: 'center'
  },
});
