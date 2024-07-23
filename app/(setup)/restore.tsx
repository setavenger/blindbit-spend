import { Button, StyleSheet, Switch, TextInput, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MarginThemedView } from '@/components/MarginThemedView';
import { Link } from 'expo-router';
import { useState } from 'react';
import { walletFromMnemonic } from '@/wallet';
import { useAppContext } from '@/context';
import { Colors } from '@/constants/Colors';

export default function RestoreScreen() {
  const {updateWallet} = useAppContext()
  const [mnemonic, setMnemonic] = useState('');
  const [useTestnet, setUseTestnet] = useState(false);
  const toggleSwitch = () => setUseTestnet(prev => !prev);


  const setupWallet = () => {
    walletFromMnemonic(mnemonic, useTestnet).then(wallet => {updateWallet(wallet)})
    .catch(error => {
     console.error(error)
     throw error
    });
  }

  return (
    <MarginThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Restore Wallet</ThemedText>
      </ThemedView>
      <ThemedText>Here you can input your seed</ThemedText>
      <ThemedText type='link'>
        <Link href={"/"}>Go Home</Link>
      </ThemedText>
      <TextInput
        style={styles.input}
        onChangeText={setMnemonic}
        value={mnemonic}
        placeholder="your mnemonic"
        keyboardType="default"
      />
      <Button 
        title={'Confirm'}
        onPress={setupWallet}
        color={'red'}
      />
      <ThemedView style={styles.toggleContainer}>
        <Switch
          style={{marginRight: 10}}
          trackColor={{false: '#767577', true: `${Colors['light'].tint}`}}
          thumbColor={useTestnet ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={useTestnet}
        />
        <ThemedText>Testnet</ThemedText>
      </ThemedView>
    </MarginThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

