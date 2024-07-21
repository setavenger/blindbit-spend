import { Image, StyleSheet, Platform, SafeAreaView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
  <SafeAreaView>
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Settings</ThemedText>
    </ThemedView>
  </SafeAreaView>
  );
}
// #003153
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
