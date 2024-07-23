import { View, ViewProps } from 'react-native';

export type SpacerProps = ViewProps & {
  horizontal?: boolean;
  magnitude?: number;
};

export function Spacer({horizontal = false, magnitude = 20, ...otherProps}: SpacerProps) {
  return (
    <View
      {...otherProps}
      style={{
        height: horizontal ? 0 : magnitude,
        width: horizontal ? magnitude : 0,
        opacity: 0,
      }}
    />
  );
}
