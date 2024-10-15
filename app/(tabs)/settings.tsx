import { Image, StyleSheet, Platform, SafeAreaView, TextInput, Switch, Button, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MarginThemedView } from '@/components/MarginThemedView';
import { useState } from 'react';
import { useAppContext } from '@/context';
import { Spacer } from '@/components/Spacer';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  return (
    <MarginThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <Spacer magnitude={40}/>
      <BlindBitBackendSettings/>
      <Spacer magnitude={10}/>
      <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}/>
      <Spacer magnitude={10}/>
      <WalletSettings/>
    </MarginThemedView>
  );
}

function BlindBitBackendSettings() {
  const {blindbitApiSettings, updateBlindbitApiSettings} = useAppContext()

  const [baseUrl, setBaseUrl] = useState(blindbitApiSettings?.baseUrl || '')
  const [user, setUser] = useState(blindbitApiSettings?.user || '')
  const [pass, setPass] = useState(blindbitApiSettings?.pass || '')
  const [tor, setTor] = useState(blindbitApiSettings?.tor || false)
  const toggleSwitch = () => setTor(prev => !prev);

  const confirmChanges = () => {
    try {
      updateBlindbitApiSettings({baseUrl, user, pass, tor})
    } catch (error) {
      throw error
    }
  }

  return (
    <ThemedView>
      <ThemedText>Set base url</ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={setBaseUrl}
        value={baseUrl}
        placeholder="http://blinbdit-scan.your-domain-or-ip.com:port"
        keyboardType="default"
        autoCapitalize='none'
      />
      <Spacer />
      <ThemedText>Set username for basic auth</ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={setUser}
        value={user}
        placeholder="username"
        keyboardType="default"
        autoCapitalize='none'
      />
      <Spacer />
      <ThemedText>Set password for basic auth</ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={setPass}
        value={pass}
        placeholder="password"
        keyboardType="default"
        autoCapitalize='none'
      />
      <Spacer />
      <ThemedView style={styles.toggleContainer}>
        <Switch
          style={{marginRight: 10}}
          trackColor={{false: '#767577', true: `${Colors['light'].tint}`}}
          thumbColor={tor ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={tor}
        />
        <ThemedText>Tor</ThemedText>
      </ThemedView>
      <Spacer />
      <ThemedView style={{backgroundColor: Colors['light'].tint}}>
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

  const deleteWalletData = () => {

  }

  return (
    <ThemedView>
      <Spacer magnitude={10}/>
      <View style={{borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth}}/>
      <Spacer magnitude={10}/>
      <ThemedText type='subtitle' style={{color: 'red'}}>Danger Zone</ThemedText>
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
