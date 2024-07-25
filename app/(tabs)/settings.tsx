import { Image, StyleSheet, Platform, SafeAreaView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MarginThemedView } from '@/components/MarginThemedView';

export default function HomeScreen() {
  return (
    <MarginThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
    </MarginThemedView>
  );
}
// #003153
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
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
