import { SafeAreaView, ViewProps, StyleSheet, ScrollView } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from './ThemedView';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function MarginThemedView({ style, lightColor, darkColor, children, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor }]}>
      <ThemedView style={[styles.root, { backgroundColor }, style]} {...otherProps}>
        {children}
      </ThemedView>
    </SafeAreaView>
  )
};

export function MarginThemedScrollView({ style, lightColor, darkColor, children, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor }]}>
      <ScrollView>
        <ThemedView style={[styles.root, { backgroundColor }, style]} {...otherProps}>
          {children}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flex: 1,
    flexDirection: 'column',
  },
})
