import { Button, StyleSheet} from 'react-native';
import { MarginThemedView } from "@/components/MarginThemedView";
import { Spacer } from "@/components/Spacer";
import { ThemedText, ThemedTextCopiable } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAppContext, useSendContext } from '@/context';
import { useEffect, useState } from 'react';
import * as bitcoin from '@/extra_modules/bitcoinjs-lib/src';
import { Colors } from '@/constants/Colors';
import { broadcastTxToMempoolSpace } from '@/api';
import { router } from 'expo-router';

export default function ConfirmTransaction() {
  const { wallet } =  useAppContext();
  const { psbt } = useSendContext();
  const [ actualFeeRate, setActualFeeRate ] = useState<number>(0)
  const [ tx, setTx ] = useState<bitcoin.Transaction | null>(null)

  const broadcastTx = async () => {
    if (!tx) return;
    if (!wallet) return;

    try {
      await broadcastTxToMempoolSpace(tx.toHex(), wallet.networkType)
      // todo: add a tx confirmed/sent screen 
      router.replace("/")
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    if (!psbt) return;
    const currTx = psbt.extractTransaction()
    setTx(currTx)
    const feeRate = psbt.getFee() / currTx.virtualSize()
    setActualFeeRate(feeRate)
  }, [psbt])


  return (
    <MarginThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Confirm Transaction</ThemedText>
      </ThemedView>
      <Spacer magnitude={40}/>
      <ThemedView style={styles.dataContainer}>
        <ThemedView style={styles.dataField}>
          <ThemedText type='subtitle'>Txid:</ThemedText>
          <ThemedTextCopiable type='default' text={tx?.getId()}/>
        </ThemedView>
        {/* Outputs */}
        <ThemedView style={{flexDirection: 'column', gap: 12}}>
          <ThemedText type='subtitle'>Outputs:</ThemedText>
          {tx?.outs.map((output, index) => {
            let addr;
            try {
              // Convert the output script to an address
              addr = bitcoin.address.fromOutputScript(output.script, wallet?.network);
            } catch (e) {
              // Handle non-standard or unrecognized scripts
              addr = 'Unrecognized script';
            }

            return (
              <ThemedView key={index}>
                <ThemedView style={styles.outputField}>
                  <ThemedText type='default' style={{fontWeight: "bold"}}>Address{index === tx.outs.length-1 && " (change)"}:</ThemedText>
                  <ThemedText type='default'>{addr}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.outputField}>
                  <ThemedText type='default' style={{fontWeight: "bold"}}>Amount:</ThemedText>
                  <ThemedText type='default'>{output.value} sats</ThemedText>
                </ThemedView>
              </ThemedView>
            );
          })}
        </ThemedView>
        <ThemedView style={styles.dataField}>
          <ThemedText type='subtitle'>Effective Fee Rate:</ThemedText>
          <ThemedText type='default'>
            {actualFeeRate.toLocaleString(undefined, {maximumFractionDigits: 2})} sats/vByte
            (total: {psbt?.getFee()} sats)
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <Spacer magnitude={40}/>
      <ThemedView style={{backgroundColor: Colors['light'].tint}}>
        <Button 
          title={'Broadcast Tx'}
          onPress={broadcastTx}
          color={'white'}
        />  
      </ThemedView>
    </MarginThemedView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dataContainer: {
    flexDirection: 'column',
    gap: 20
  },
  dataField: {
    flexDirection: 'column',
    gap: 2
  },
  outputField: {
    flexDirection: 'column',
    gap: 0,
  },
});

