import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MarginThemedView } from '@/components/MarginThemedView';
import QRCode from 'react-native-qrcode-svg';
import { Spacer } from '@/components/Spacer';
import { useAppContext } from '@/context';
import { useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

export default function SendScreen() {
  const {wallet} = useAppContext()
  const [copied, setCopied] = useState(false);

  if (!wallet) {
    return (
      <MarginThemedView>
        <ThemedView>
          <ThemedText>Wallet is not loaded</ThemedText>
        </ThemedView>
      </MarginThemedView>
    )
  };

  const onPressAddress = () => {
    Clipboard.setString(wallet.address);
    setCopied(true);
  };
  
  return (
    <MarginThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Receive</ThemedText>
      </ThemedView>
      <Spacer magnitude={30} />
      <View style={{alignItems: 'center'}}>
        <QRCode size={300} value={'bitcoin:' + wallet.address} />
        <Spacer />
        <TouchableOpacity onPress={onPressAddress}>
          <ThemedText style={{textAlign: 'center'}}>{wallet.address}</ThemedText>
        </TouchableOpacity>
        {copied && (
          <>
            <Spacer magnitude={10} />
            <ThemedText style={{fontSize: 12, color: 'gray'}}>
              Copied to Clipboard
            </ThemedText>
          </>
        )}
      </View>
    </MarginThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
