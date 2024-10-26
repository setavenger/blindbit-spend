import { Utxo } from "@/api";
import { MarginThemedScrollView } from "@/components/MarginThemedView";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAppContext } from "@/context";
import { useEffect, useState } from "react";
import { StyleSheet} from 'react-native';


export default function UtxoViewScreen() {
  const { wallet } = useAppContext();
  const [utxos, setUtxos] = useState<Utxo[]>([]);

  useEffect(() => {
    if (!wallet) return;
    const filteredUtxos = wallet.utxos.filter(u => u.utxo_state === 'unspent').sort((u1, u2) => u2.timestamp - u1.timestamp);
    setUtxos(filteredUtxos);
  }, [wallet])

  return (
    <MarginThemedScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Utxo Overview</ThemedText>
      </ThemedView>
      <Spacer magnitude={40}/>
      <ThemedView>
        {utxos.map((utxo, index) => {
          return (
            <ThemedView key={index} style={styles.utxoContainer}>
              <ThemedView style={styles.outputField}>
                <ThemedText type='default' style={{fontWeight: "bold"}}>
                  UTXO{utxo.label && utxo.label.m === 0 && " (change)"}:
                </ThemedText>
                <ThemedText type='default'>{utxo.txid}:{utxo.vout}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.outputField}>
                <ThemedText type='default' style={{fontWeight: "bold"}}>Amount:</ThemedText>
                <ThemedText type='default'>{utxo.amount.toLocaleString(undefined, {maximumFractionDigits: 2})} sats</ThemedText>
              </ThemedView>
              <ThemedView style={styles.outputField}>
                <ThemedText type='default' style={{fontWeight: "bold"}}>Received:</ThemedText>
                <ThemedText type='default'>
                  {new Date(utxo.timestamp*1000).toLocaleString()}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          );
        })}
      </ThemedView>
    </MarginThemedScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  utxoContainer: {
    marginBottom: 16,
  },
  outputField: {
    flexDirection: 'column',
    gap: 0,
  },
});



