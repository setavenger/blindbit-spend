import { StyleSheet, Button, View, Alert } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MarginThemedView } from '@/components/MarginThemedView';
import { useState } from 'react';
import { useAppContext } from '@/context';
import { Spacer } from '@/components/Spacer';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { ThemedTextInput } from '@/components/ThemedTextInput';

export default function SettingsScreen() {
  return (
    <MarginThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <Spacer magnitude={40} />
      <BlindBitBackendSettings />
      <Spacer magnitude={10} />
      <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth }} />
      <Spacer magnitude={10} />
      <WalletSettings />
    </MarginThemedView>
  );
}

function BlindBitBackendSettings() {
  const { updateBlindbitNwcService } = useAppContext()

  const [nwcUri, setNwcUri] = useState("")

  const confirmChanges = () => {
    try {
      updateBlindbitNwcService(nwcUri);
      router.replace("/")
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return (
    <ThemedView>
      <ThemedText>Set base url</ThemedText>
      <ThemedTextInput
        style={styles.input}
        onChangeText={setNwcUri}
        value={nwcUri}
        placeholder="nostr+walletconnect://..."
        keyboardType="default"
        autoCapitalize='none'
      />
      <Spacer />
      <ThemedView style={{ backgroundColor: Colors['light'].tint }}>
        <Button
          title={'Save BlindBit settings'}
          onPress={confirmChanges}
          color={'white'}
        />
      </ThemedView>
    </ThemedView>
  )
}


function WalletSettings() {
  const { deleteWallet } = useAppContext()

  const deleteWalletData = () => {
    Alert.alert(
      "Deletion warning",
      `Are you sure you want to delete your wallet. The private keys will be lost from this device.`,
      [
        {
          text: "Cancel",
          onPress: () => { return }, // abort transaction
          style: 'cancel'
        },
        {
          text: "Confirm",
          onPress: async () => {
            await deleteWallet()
          },
          style: 'default'
        }
      ],
      { cancelable: false }
    )

  }

  return (
    <ThemedView>
      <Spacer magnitude={10} />
      <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth }} />
      <Spacer magnitude={10} />
      <ThemedText type='subtitle' style={{ color: 'red' }}>Danger Zone</ThemedText>
      <Button
        title={'Delete Wallet Data'}
        onPress={deleteWalletData}
        color={'red'}
      />
    </ThemedView>
  )
}

// #003153
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    height: 40,
    marginTop: 6,
    // margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  }
});
