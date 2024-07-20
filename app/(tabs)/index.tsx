import { StyleSheet, SafeAreaView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { MarginThemedView } from '@/components/MarginThemedView';

export default function HomeScreen() {

  // define states
  const [syncHeight, setSyncHeight] = useState(853351);

  // load Data
  useEffect(() => {
    
  }, [])

  return (
      <MarginThemedView>
        <ThemedView style={styles.topBar}>
          <ThemedText>Height: {syncHeight.toLocaleString()}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.body}>
          <ThemedText>Body Text </ThemedText>
          <ThemedText>Body Text </ThemedText>
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
