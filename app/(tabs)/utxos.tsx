import { Utxo } from "@/api";
import { MarginThemedScrollView } from "@/components/MarginThemedView";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAppContext } from "@/context";
import { useEffect, useState } from "react";
import { Linking, StyleSheet} from 'react-native';


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
          const openUtxoInMempool = async () => {
            if (!wallet) return;
            let baseUrl: string = "https://mempool.space";
            if (wallet.networkType === "signet") {
              baseUrl = `${baseUrl}/signet`
            } else if (wallet.networkType == "testnet") {
              baseUrl = `${baseUrl}/testnet`
            }

            const linkForTx = `${baseUrl}/tx/${utxo.txid}#vout=${utxo.vout}`
            Linking.canOpenURL(linkForTx).then(supported => {
              if (supported) {
                Linking.openURL(linkForTx);
              } else {
                console.log("Don't know how to open URI: " + linkForTx);
              }
            });
          };

          return (
            <ThemedView key={index} style={styles.utxoContainer}>
              <ThemedView style={styles.outputField}>
                <ThemedText type='default' style={{fontWeight: "bold"}}>
                  Outpoint{utxo.label && utxo.label.m === 0 && " (change)"}:
                </ThemedText>
                <ThemedText type='link' onPress={openUtxoInMempool}>
                  {utxo.txid}:{utxo.vout}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.outputField}>
                <ThemedText type='default' style={{fontWeight: "bold"}}>
                  Amount:
                </ThemedText>
                <ThemedText type='default'>
                  {utxo.amount.toLocaleString(undefined, {maximumFractionDigits: 0})} sats
                </ThemedText>
              </ThemedView>
              {utxo.label && (
                <ThemedView style={styles.outputField}>
                  <ThemedText type='default' style={{fontWeight: "bold"}}>
                    Label:
                  </ThemedText>
                  <ThemedText type='default'>
                    {utxo.label && utxo.label.m.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </ThemedText>
                </ThemedView>
              )}
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



