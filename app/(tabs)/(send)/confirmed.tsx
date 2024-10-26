import { MarginThemedView } from "@/components/MarginThemedView";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAppContext, useSendContext } from "@/context";
import { Linking, StyleSheet} from 'react-native';


export default function ConfirmedScreen() {
  const { wallet } = useAppContext()
  const { psbt } = useSendContext()

  const tx = psbt?.extractTransaction(true)

  const openTxUrl = async () => {
    if (!wallet) return;
    let baseUrl: string = "https://mempool.space";
    if (wallet.networkType === "signet") {
      baseUrl = `${baseUrl}/signet`
    } else if (wallet.networkType == "testnet") {
      baseUrl = `${baseUrl}/testnet`
    }

    const linkForTx = `${baseUrl}/tx/${tx?.getId()}`
    Linking.canOpenURL(linkForTx).then(supported => {
      if (supported) {
        Linking.openURL(linkForTx);
      } else {
        console.log("Don't know how to open URI: " + linkForTx);
      }
    });
  }

  return (
    <MarginThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Transaction Confirmation</ThemedText>
      </ThemedView>
      <Spacer magnitude={40}/>
      <ThemedView>
        <ThemedText type="subtitle">View Transaction</ThemedText>
        <ThemedText type="link" onPress={openTxUrl}>
            {tx?.getId()}
        </ThemedText>
      </ThemedView>
    </MarginThemedView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});


