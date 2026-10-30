import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ThemePreference } from '../theme/ThemeContext';
import { GlassSurface } from './glass/GlassSurface';
import { radius, spacing } from '../theme/tokens';

export function ThemeSelector() {
  const { preference, setPreference, theme } = useTheme();

  const options: { key: ThemePreference; label: string }[] = [
    { key: 'light', label: 'Claro' },
    { key: 'dark', label: 'Escuro' },
    { key: 'system', label: 'Sistema' },
  ];

  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const active = preference === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => setPreference(opt.key)}
            style={styles.flex}
          >
            <GlassSurface
              radius={radius.md}
              tint={active ? theme.primary : theme.glass}
              opacity={active ? 0.9 : 0.4}
              style={styles.opt}
            >
              <Text
                style={[styles.label, { color: active ? theme.onPrimary : theme.text }]}
              >
                {opt.label}
              </Text>
            </GlassSurface>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
  opt: { paddingVertical: spacing.sm, alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '700' },
});
