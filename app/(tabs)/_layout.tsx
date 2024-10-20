import { ViewProps } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppContext } from '@/context';
import { MarginThemedView } from '@/components/MarginThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function TabLayout() {
  const {wallet, appState} = useAppContext()

  const colorScheme = useColorScheme();

  if (!wallet) {
    switch (appState) {
      case "Loading":
        // basically another splash screen.
        return <WaitingScreen waitText={'Loading Wallet...'} />
      case 'Loaded':
        if (!wallet) {
          throw new Error("There should have been a wallet but none was found")
        }
        break
      case 'New':
      default:
        return <Redirect href="/restore" />;
    }
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(send)"
        options={{
          title: 'Send',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'paper-plane' : 'paper-plane-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="receive"
        options={{
          title: 'Receive',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'qr-code' : 'qr-code-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cog' : 'cog-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export type WaitingScreenProps = ViewProps & {
  waitText: string;
};


function WaitingScreen({waitText, style, ...otherProps}: WaitingScreenProps) {
  return (
    <MarginThemedView style={[{flex: 1, alignItems: 'center'}, style]} {...otherProps}>
      <ThemedText type='title'>{waitText}</ThemedText>
    </MarginThemedView>
  )
}
