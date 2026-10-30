import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface GlassSurfaceProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  tint?: string;
  intensity?: number;
  opacity?: number;
}

interface GlassSurfaceProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  tint?: string;
  intensity?: number;
  opacity?: number;
}

export function GlassSurface({
  children,
  style,
  radius = 24,
  tint,
  intensity = 40,
  opacity,
}: GlassSurfaceProps) {
  const { theme } = useTheme();
  const glassTint = tint ?? theme.glass;

  return (
    <View style={[{ borderRadius: radius, overflow: 'hidden' }, style]}>
      <BlurView
        intensity={intensity}
        tint={theme.mode === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: glassTint,
            opacity: opacity ?? (theme.mode === 'dark' ? 0.55 : 0.5),
          },
        ]}
      />
      <LinearGradient
        colors={[theme.glassHighlight, 'transparent']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.7, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius, borderWidth: 1, borderColor: theme.glassBorder },
        ]}
      />
      <View style={{ borderRadius: radius }}>{children}</View>
    </View>
  );
}

export function glassShadow(color: string): ViewStyle {
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: color,
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 6 },
    default: {
      shadowColor: color,
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
  }) as ViewStyle;
}
