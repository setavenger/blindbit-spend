import React from 'react';
import { StyleSheet, Button, View, Alert, Switch } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MarginThemedView } from '@/components/MarginThemedView';
import { useState } from 'react';
import { useAppContext } from '@/context';
import { Spacer } from '@/components/Spacer';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { BlindBitServiceType } from '@/api/blindbit';

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
  const [serviceType, setServiceType] = useState<BlindBitServiceType>('nwc')
  
  // NWC settings
  const [nwcUri, setNwcUri] = useState("")
  
  // REST API settings
  const [baseURL, setBaseURL] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const confirmChanges = () => {
    try {
      if (serviceType === 'nwc') {
        updateBlindbitNwcService(nwcUri);
      } else {
        // TODO: Implement REST API update
        console.log('REST API update not implemented yet');
      }
      router.replace("/")
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return (
    <ThemedView>
      <ThemedText>BlindBit Backend Settings</ThemedText>
      <Spacer magnitude={20} />
      
      <View style={styles.toggleContainer}>
        <ThemedText style={{ flex: 1 }}>Connection Type:</ThemedText>
        <Switch
          value={serviceType === 'rest-api'}
          onValueChange={(value) => setServiceType(value ? 'rest-api' : 'nwc')}
        />
        <Spacer horizontal={true} magnitude={12} />
        <ThemedText style={{ minWidth: 80 }}>{serviceType === 'rest-api' ? 'REST API' : 'NWC'}</ThemedText>
      </View>
      
      <Spacer magnitude={24} />

      {serviceType === 'nwc' ? (
        <>
          <ThemedText>NWC URI</ThemedText>
          <ThemedTextInput
            style={styles.input}
            onChangeText={setNwcUri}
            value={nwcUri}
            placeholder="nostr+walletconnect://..."
            keyboardType="default"
            autoCapitalize='none'
          />
        </>
      ) : (
        <>
          <ThemedText>Base URL</ThemedText>
          <ThemedTextInput
            style={styles.input}
            onChangeText={setBaseURL}
            value={baseURL}
            placeholder="https://your-api-url.com"
            keyboardType="url"
            autoCapitalize='none'
          />
          <Spacer magnitude={10} />
          <ThemedText>Username</ThemedText>
          <ThemedTextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="Username"
            keyboardType="default"
            autoCapitalize='none'
          />
          <Spacer magnitude={10} />
          <ThemedText>Password</ThemedText>
          <ThemedTextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            keyboardType="default"
            autoCapitalize='none'
            secureTextEntry
          />
        </>
      )}

      <Spacer />
      <ThemedView style={{ backgroundColor: Colors['light'].tint }}>
        <Button
          title={`Save ${serviceType === 'rest-api' ? 'REST API' : 'NWC'} settings`}
          onPress={confirmChanges}
          color={'gray'}
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
    borderWidth: 1,
    padding: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  }
});
