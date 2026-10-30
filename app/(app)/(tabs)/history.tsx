import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Card } from '../../../src/components/Card';
import { listRuns } from '../../../src/services/runs';
import { useTheme } from '../../../src/theme/ThemeContext';
import { spacing } from '../../../src/theme/tokens';
import type { Run } from '../../../src/types';
import { formatDistance, formatDuration, formatPace } from '../../../src/utils/geo';

export default function HistoryScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const {
    data: runs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['runs'],
    queryFn: listRuns,
  });

  const renderItem = ({ item }: { item: Run }) => {
    const dateStr = new Date(item.startedAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return (
      <Pressable onPress={() => router.push(`/run/${item.id}`)}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={[styles.date, { color: theme.muted }]}>{dateStr}</Text>
            {item.spotifyTrackName && (
              <View style={styles.spotifyTag}>
                <Feather name="music" size={12} color={theme.primary} />
                <Text
                  style={[styles.spotifyText, { color: theme.muted }]}
                  numberOfLines={1}
                >
                  {item.spotifyTrackName}
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.distance, { color: theme.text }]}>
            {formatDistance(item.distanceMeters)}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <Feather name="clock" size={14} color={theme.muted} />
              <Text style={[styles.footerText, { color: theme.text }]}>
                {formatDuration(item.durationSeconds)}
              </Text>
            </View>

            <View style={styles.footerItem}>
              <Feather name="zap" size={14} color={theme.muted} />
              <Text style={[styles.footerText, { color: theme.text }]}>
                {formatPace(item.avgPaceSecPerKm)}
              </Text>
            </View>
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Histórico</Text>
      </View>

      <FlatList
        data={runs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={String(theme.primary)}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Feather name="navigation" size={48} color={theme.muted} />
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                Nenhuma corrida registrada ainda.
              </Text>
            </View>
          ) : undefined
        }
      />
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
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
    gap: spacing.md,
  },
  card: { gap: spacing.xs },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
  spotifyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '50%',
  },
  spotifyText: { fontSize: 12 },
  distance: { fontSize: 28, fontWeight: '900' },
  cardFooter: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 14, fontWeight: '700' },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
  emptyText: { fontSize: 15 },
});
