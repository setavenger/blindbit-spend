import { TextInput, type TextInputProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'outlined' | 'rounded' | 'underline';
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const placeholderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'placeholder');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');

  return (
    <TextInput
      style={[
        { color, backgroundColor, borderColor },
        styles.input,
        type === 'default' && styles.default,
        type === 'outlined' && styles.outlined,
        type === 'rounded' && styles.rounded,
        type === 'underline' && styles.underline,
        style,
      ]}
      placeholderTextColor={placeholderColor}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  default: {
    borderWidth: 1,
    borderRadius: 4,
  },
  outlined: {
    borderWidth: 1,
    borderRadius: 0,
  },
  rounded: {
    borderWidth: 1,
    borderRadius: 25,
  },
  underline: {
    borderBottomWidth: 1,
    borderRadius: 0,
  },
});
