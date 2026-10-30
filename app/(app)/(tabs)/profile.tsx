import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../src/components/Button';
import { Card } from '../../../src/components/Card';
import { ThemeSelector } from '../../../src/components/ThemeSelector';
import { useAuth } from '../../../src/context/AuthContext';
import { useSpotify } from '../../../src/context/SpotifyContext';
import { useTheme } from '../../../src/theme/ThemeContext';
import { spacing } from '../../../src/theme/tokens';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const { tokens, connect, disconnect } = useSpotify();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Perfil</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.userCard}>
          <Feather name="user" size={32} color={theme.primary} />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user?.user_metadata?.full_name ?? 'Atleta'}
            </Text>
            <Text style={[styles.userEmail, { color: theme.muted }]}>
              {user?.email ?? ''}
            </Text>
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Aparência</Text>
          <ThemeSelector />
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Integrações</Text>
          <View style={styles.spotifyRow}>
            <View style={styles.spotifyInfo}>
              <Feather name="music" size={20} color={theme.primary} />
              <Text style={[styles.spotifyStatus, { color: theme.text }]}>
                {tokens ? 'Spotify Conectado' : 'Spotify Desconectado'}
              </Text>
            </View>
            {tokens ? (
              <Button
                title="Desconectar"
                variant="ghost"
                onPress={() => void disconnect()}
              />
            ) : (
              <Button title="Conectar" variant="secondary" onPress={connect} />
            )}
          </View>
        </Card>

        <Button title="Sair da Conta" variant="danger" onPress={() => void signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.md,
  },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  content: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '800' },
  userEmail: { fontSize: 13 },
  sectionCard: { gap: spacing.sm },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  spotifyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotifyInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  spotifyStatus: { fontSize: 14, fontWeight: '600' },
});
