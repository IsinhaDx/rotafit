import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../src/components/Button';
import { Card } from '../../../src/components/Card';
import { SpotifyPlayerCard } from '../../../src/components/spotify/SpotifyPlayerCard';
import { useWeeklyStats } from '../../../src/hooks/useWeeklyStats';
import { useTheme } from '../../../src/theme/ThemeContext';
import { radius, spacing } from '../../../src/theme/tokens';
import { formatDistance, formatDuration } from '../../../src/utils/geo';

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data: stats, isLoading, refetch } = useWeeklyStats();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => {
            void refetch();
          }}
          tintColor={String(theme.primary)}
        />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.welcome, { color: theme.muted }]}>Bora correr?</Text>
        <Text style={[styles.title, { color: theme.text }]}>Início</Text>
      </View>

      <Card style={styles.heroCard}>
        <Text style={[styles.cardLabel, { color: theme.muted }]}>Nesta semana</Text>
        <Text style={[styles.bigStat, { color: theme.primary }]}>
          {formatDistance(stats?.totalDistanceMeters ?? 0)}
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Feather name="clock" size={16} color={theme.muted} />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {formatDuration(stats?.totalDurationSeconds ?? 0)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Feather name="activity" size={16} color={theme.muted} />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {stats?.runCount ?? 0} {stats?.runCount === 1 ? 'corrida' : 'corridas'}
            </Text>
          </View>
        </View>
      </Card>

      <Button
        title="Iniciar corrida"
        onPress={() => router.push('/run/active')}
        style={styles.cta}
      />

      <SpotifyPlayerCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
    paddingBottom: 100,
    gap: spacing.lg,
  },
  header: { gap: spacing.xs },
  welcome: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  heroCard: { gap: spacing.sm },
  cardLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  bigStat: { fontSize: 44, fontWeight: '900', letterSpacing: -1 },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statValue: { fontSize: 15, fontWeight: '700' },
  cta: { marginTop: spacing.xs },
});
