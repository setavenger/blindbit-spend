import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MarginThemedView } from '@/components/MarginThemedView';

export default function SendScreen() {
  return (
    <MarginThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Receive</ThemedText>
      </ThemedView>
      <ThemedText>Will show your QR Code</ThemedText>
    </MarginThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
