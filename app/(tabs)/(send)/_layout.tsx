import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { SendContextProvider, useAppContext } from '@/context';

export default function SendLayout() {
  const {wallet} = useAppContext()

  useEffect(()=> {
    // if the wallet is null go to setup 
    if (!wallet) {
      console.log("no wallet")
      router.replace('/tabs')
    };
  })

  return (
    <SendContextProvider>
      <Stack initialRouteName={'/index'}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="review" options={{ headerShown: false }} />
        <Stack.Screen name="confirmed" options={{ headerShown: false }} />
      </Stack>
    </SendContextProvider>
  );
}
