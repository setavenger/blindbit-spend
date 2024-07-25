import { Alert, Button, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {NumericFormat} from 'react-number-format';
import { useState } from 'react';
import { MarginThemedView } from '@/components/MarginThemedView';
import { Spacer } from '@/components/Spacer';
import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context';

export default function SendScreen() {
  const { wallet } = useAppContext()
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(''); // for storing the formatted display value
  const [fee, setFee] = useState(0);
  const [displayFee, setDisplayFee] = useState(''); // for storing the formatted display value

  const handleAmountChange = (text: string) => {
    // Extract numbers only from the input
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(parseInt(numericValue));
    // Update display amount here (or you can derive it directly in your JSX, but we'll update it here for simplicity)
    setDisplayAmount(text);
  };

  const handleFeeChange = (text: string) => {
    // Extract numbers only from the input
    const numericValue = text.replace(/[^0-9]/g, '');
    setFee(parseInt(numericValue));
    // Update display amount here (or you can derive it directly in your JSX, but we'll update it here for simplicity)
    setDisplayFee(text);
  };


  const createTx = () => {
    if (!wallet) {Alert.alert("no wallet is set up"); return};
    try {
      wallet.makeTransaction([{address, value: amount}], fee)
    } catch (error) {
     throw error 
    }
  }

  return (
    <MarginThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Send</ThemedText>
      </ThemedView>
      <Spacer magnitude={40}/>
      <ThemedView>
        <ThemedText type={'subtitle'}>Recipient Address</ThemedText>
        <ThemedView style={[styles.inputField]}>
          <TextInput
            autoCorrect={false}
            autoCapitalize={'none'}
            style={{
              flex: 1,
              height: 40,
              color: '#000000',
            }}
            onChangeText={setAddress}
            placeholder="bc1p..."
            value={address}
          />
        </ThemedView>
      </ThemedView>
      <Spacer  magnitude={40}/>
      <ThemedView>
        <ThemedText type={'subtitle'}>Amount (sats)</ThemedText>
        <ThemedView style={[styles.inputField]}>
          <NumericFormat
            value={displayAmount}
            displayType={'text'}
            thousandSeparator={true}
            renderText={value => (
              <TextInput
                autoCorrect={false}
                autoCapitalize={'none'}
                onChangeText={handleAmountChange}
                value={value}
                placeholder="Amount in Sats"
                keyboardType="numeric"
                style={{height: 40}}
              />
            )}
          />
        </ThemedView>
      </ThemedView>
      <Spacer magnitude={40} />
      <ThemedView>
        <ThemedText type={'subtitle'}>Fee (sat/vByte)</ThemedText>
        <ThemedView style={[styles.inputField]}>
          <NumericFormat
            value={displayFee}
            displayType={'text'}
            thousandSeparator={true}
            renderText={value => (
              <TextInput
                autoCorrect={false}
                autoCapitalize={'none'}
                onChangeText={handleFeeChange}
                value={value}
                placeholder="sats/vByte"
                keyboardType="numeric"
                style={{height: 40}}
              />
            )}
          />
        </ThemedView>
      </ThemedView>
      <Spacer/>
      <ThemedView style={{alignItems: 'center'}}>
        <ThemedView style={{backgroundColor: Colors['light'].tint}}>
          <Button 
            title={'Confirm'}
            onPress={createTx}
            color={'white'}
          />
        </ThemedView>
      </ThemedView>
    </MarginThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  inputField: {
    height: 40,
    borderRadius: 3,
    borderWidth: 0.7,
    borderColor: 'black',
    padding: 10,
    justifyContent: 'center',
  },

});
