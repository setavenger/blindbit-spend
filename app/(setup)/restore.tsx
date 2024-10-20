import { Button, StyleSheet, Switch, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MarginThemedView } from '@/components/MarginThemedView';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { network, walletFromMnemonic } from '@/wallet';
import { useAppContext } from '@/context';
import { Colors } from '@/constants/Colors';
import RNPickerSelect from 'react-native-picker-select';
import { Spacer } from '@/components/Spacer';
import { ThemedTextInput } from '@/components/ThemedTextInput';

export default function RestoreScreen() {
  const { wallet, updateWallet } = useAppContext()
  const [mnemonic, setMnemonic] = useState('');
  const [useTestnet, setUseTestnet] = useState(true); // is inverted
  const [network, setNetwork] = useState<network>('mainnet')
  const toggleSwitch = () => setUseTestnet(prev => {
    // !prev is the new value
    // if the new value is false then set network back to main automatically
    if (prev) {
      setNetwork('mainnet')
    }
    return !prev
  });

  useEffect(() => {
    if (wallet) {
      router.replace("/")
    }
  }, [wallet])

  const setupWallet = async () => {
    try {
      const newWallet = await walletFromMnemonic(mnemonic, network)
      await updateWallet(newWallet);
      // on success
      router.replace("/");
    } catch (error) {
     console.error(error)
     throw error
    }
  }

  const TestnetSelector = () => {
    if (!useTestnet) return null;
    return (
      <ThemedView style={{marginTop: 20}}>
        <ThemedText type='defaultSemiBold'>Pick a test network</ThemedText>
        <ThemedView style={{borderColor: 'black', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 }}>
          <RNPickerSelect
            onValueChange={(value) => setNetwork(value)}
            items={NetworkOptions}
            value={network}
            itemKey={network}
          /> 
        </ThemedView>
      </ThemedView>
    )
  }

  return (
    <MarginThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Restore Wallet</ThemedText>
      </ThemedView>
      <Spacer />
      <ThemedText>Here you can input your seed</ThemedText>
      <ThemedTextInput
        style={styles.input}
        onChangeText={setMnemonic}
        value={mnemonic}
        placeholder="your mnemonic"
        keyboardType="default"
        autoCapitalize='none'
      />
      <Spacer magnitude={10}/>
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
      <TestnetSelector/>
      <ThemedView>
        <ThemedText>Selected Network: <ThemedText type='defaultSemiBold'>{network}</ThemedText></ThemedText>
      </ThemedView>
      <Button 
        title={'Confirm'}
        onPress={setupWallet}
        color={'red'}
      />
    </MarginThemedView>
  );
}

interface networkOption {
  label: string
  value: network
}

const NetworkOptions: networkOption[] = [
  // don't show mainnet, mainent is default
  // {
  //   label: "Mainnet",
  //   value: 'mainnet',
  // },
  {
    label: 'testnet',
    value: 'testnet',
  },
  {
    label: 'signet',
    value: 'signet',
  },
  {
    label: 'regtest',
    value: 'regtest',
  }
]

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
  }
});

