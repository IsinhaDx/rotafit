import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { signInWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleGoogle = async () => {
    try {
      setSubmitting(true);
      await signInWithGoogle();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha no login com Google.';
      Alert.alert('Erro no login', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.hero}>
        <View style={[styles.badge, { backgroundColor: theme.primarySoft }]}>
          <Feather name="navigation" size={36} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>RotaFit</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Corrida com GPS, estilo Liquid Glass e sua trilha do Spotify.
        </Text>
      </View>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Bem-vindo</Text>
        <Text style={[styles.cardSub, { color: theme.muted }]}>
          Entre com sua conta do Google para sincronizar suas corridas na nuvem.
        </Text>
        <Button
          title="Continuar com Google"
          onPress={handleGoogle}
          loading={submitting}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  hero: { alignItems: 'center', gap: spacing.xs },
  badge: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  subtitle: { fontSize: 15, textAlign: 'center', paddingHorizontal: spacing.md },
  card: { gap: spacing.md },
  cardTitle: { fontSize: 20, fontWeight: '800' },
  cardSub: { fontSize: 14, lineHeight: 20 },
});
