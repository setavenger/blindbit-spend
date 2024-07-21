import { Button, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MarginThemedView } from '@/components/MarginThemedView';
import { Link } from 'expo-router';
import { useState } from 'react';
// import { walletFromMnemonic } from '@/wallet';
import { useAppContext } from '@/context';

export default function RestoreScreen() {
  const {updateWallet} = useAppContext()
  const [mnemonic, setMnemonic] = useState('');

  console.log("we are at restore")

  const setupWallet = () => {

    // walletFromMnemonic(mnemonic).then(wallet => {updateWallet(wallet)})
    // .catch(error => {
    //  console.error(error)
    //  throw error
    // });
    
    walletFromMnemonic(mnemonic).then(()=> console.log("done"))
    .catch(error => {
     console.error(error)
     throw error
    });


    updateWallet(null);
  }

  console.log("we are at restore")

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
});

import { Wallet } from "@/wallet";
import * as bip39 from 'bip39';
import * as splib from '@/splib';
//
// export async function walletFromMnemonic(mnemonic: string ) {
//   console.log(mnemonic);
//   // console.log(mnemonic);
//   const seed = await bip39.mnemonicToSeed(mnemonic);
//   console.log(seed);
//   const {scan, spend} = splib.deriveSilentPaymentKeyPair(seed);
//
//   // todo proper handling for labels insert them in scanning and create change label automatically
//
//   // return new Wallet(scan, spend, mnemonic, birthHeight, labels);
//   return new Wallet(scan, spend, mnemonic);
// }
//

export async function walletFromMnemonic(mnemonic: string ): Promise<null> {
  console.log(mnemonic);
  // console.log(mnemonic);
  // const seed = await bip39.mnemonicToSeed(mnemonic);
  // console.log(seed);
  const {scan, spend} = splib.deriveSilentPaymentKeyPair(Buffer.from("ac34", "hex"));

  // return new Wallet(scan, spend, mnemonic, birthHeight, labels);
  // return new Wallet(scan, spend, mnemonic);
  
  return null
}


