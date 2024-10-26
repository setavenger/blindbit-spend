import { Alert, Button, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {NumericFormat} from 'react-number-format';
import { useState } from 'react';
import { MarginThemedView } from '@/components/MarginThemedView';
import { Spacer } from '@/components/Spacer';
import { Colors } from '@/constants/Colors';
import { useAppContext, useSendContext } from '@/context';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { router } from 'expo-router';

export default function SendScreen() {
  const { wallet } = useAppContext();
  const { updatePsbt } = useSendContext();
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


  const createTx = async () => {
    if (!wallet) {Alert.alert("no wallet is set up"); return};
    if (fee < 5) {
      Alert.alert(
        "Fee warning", 
        `Your chosen fee of ${fee} is very low`, 
        [
          {
            text: "Cancel",
            onPress: () => { return }, // abort transaction
            style: 'cancel'
          },
          {
            text: "Confirm",
            onPress: () => {
              try {
                const newPsbt = wallet.makeTransaction([{address, value: amount}], fee);
                updatePsbt(newPsbt);
                router.push("/review")
              } catch (error) {
               console.error(error)
               throw error 
              }
            },
            style: 'default'
          }
        ],
        { cancelable: false }
      )
      return;
    }

    // do normal if fee is not very low
    try {
      const newPsbt = wallet.makeTransaction([{address, value: amount}], fee);
      updatePsbt(newPsbt);
      router.navigate("/review")
    } catch (error) {
     console.error(error)
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
        <ThemedTextInput
          autoCorrect={false}
          autoCapitalize={'none'}
          style={styles.input}
          onChangeText={setAddress}
          placeholder="bc1p..."
          value={address}
        />
      </ThemedView>
      <Spacer  magnitude={40}/>
      <ThemedView>
        <ThemedText type={'subtitle'}>Amount (sats)</ThemedText>
        <ThemedView style={[]}>
          <NumericFormat
            value={displayAmount}
            displayType={'text'}
            thousandSeparator={true}
            renderText={value => (
              <ThemedTextInput
                autoCorrect={false}
                autoCapitalize={'none'}
                onChangeText={handleAmountChange}
                value={value}
                placeholder="Amount in Sats"
                keyboardType="numeric"
                style={styles.input}
              />
            )}
          />
        </ThemedView>
      </ThemedView>
      <Spacer magnitude={40} />
      <ThemedView>
        <ThemedText type={'subtitle'}>Fee (sat/vByte)</ThemedText>
        <ThemedView>
          <NumericFormat
            value={displayFee}
            displayType={'text'}
            thousandSeparator={true}
            renderText={value => (
              <ThemedTextInput
                autoCorrect={false}
                autoCapitalize={'none'}
                onChangeText={handleFeeChange}
                value={value}
                placeholder="sats/vByte"
                keyboardType="numeric"
                style={styles.input}
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
  input: {
    height: 40,
    marginTop: 6,
    // margin: 12,
    borderWidth: 1,
    padding: 10,
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

