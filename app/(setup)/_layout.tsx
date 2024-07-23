import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useAppContext } from '@/context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const {wallet} = useAppContext()

  useEffect(()=> {
    // try to load wallet from storage
    // if the wallet is null go to setup 
    if (!wallet) {
      console.log("no wallet")
      // router.push('/tabs')
    };
  })

  return (
    <Stack>
      <Stack.Screen name="restore" options={{ headerShown: false }} />
    </Stack>
  );
}
