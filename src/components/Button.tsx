import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { GlassSurface, glassShadow } from './glass/GlassSurface';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'dark';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const { theme } = useTheme();
  const inactive = disabled || loading;
  const tint =
    variant === 'primary'
      ? theme.primary
      : variant === 'danger'
        ? theme.danger
        : variant === 'dark'
          ? '#050505'
          : theme.glass;

  const labelColor =
    variant === 'primary' || variant === 'danger' || variant === 'dark'
      ? theme.onPrimary
      : variant === 'secondary'
        ? theme.primary
        : theme.muted;

  const glow = variant === 'ghost' ? 'transparent' : tint;
  const solidOpacity = variant === 'ghost' ? 0.12 : variant === 'secondary' ? 0.6 : 0.94;
  const solidIntensity =
    variant === 'primary' || variant === 'danger' || variant === 'dark' ? 0 : 40;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        inactive && styles.inactive,
        pressed && styles.pressed,
        style,
      ]}
    >
      <GlassSurface
        tint={variant === 'ghost' ? undefined : tint}
        radius={radius.pill}
        style={[styles.base, glassShadow(glow)]}
        intensity={solidIntensity}
        opacity={solidOpacity}
      >
        {loading ? (
          <ActivityIndicator color={labelColor} />
        ) : (
          <Text style={[styles.label, { color: labelColor }]}>{title}</Text>
        )}
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  inactive: { opacity: 0.45 },
});
