import { Feather } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../src/components/Button';
import { Card } from '../../../src/components/Card';
import { RouteMap } from '../../../src/components/RouteMap';
import { queryClient } from '../../../src/lib/queryClient';
import { deleteRun, getRun } from '../../../src/services/runs';
import { useTheme } from '../../../src/theme/ThemeContext';
import { spacing } from '../../../src/theme/tokens';
import {
  estimateCalories,
  formatDistance,
  formatDuration,
  formatPace,
} from '../../../src/utils/geo';

export default function RunDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: run, isLoading } = useQuery({
    queryKey: ['run', id],
    queryFn: () => getRun(id),
    enabled: Boolean(id),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRun,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['weekly-stats'] });
      void queryClient.invalidateQueries({ queryKey: ['runs'] });
      router.back();
    },
    onError: (err: Error) => {
      Alert.alert('Erro ao apagar', err.message);
    },
  });

  const handleDelete = () => {
    Alert.alert('Apagar corrida', 'Tem certeza que deseja apagar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: () => id && deleteMutation.mutate(id),
      },
    ]);
  };

  if (isLoading || !run) {
    return (
      <View
        style={[styles.container, styles.center, { backgroundColor: theme.background }]}
      >
        <Text style={{ color: theme.muted }}>Carregando detalhes...</Text>
      </View>
    );
  }

  const calories = estimateCalories(run.distanceMeters, run.durationSeconds);
  const dateStr = new Date(run.startedAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.date, { color: theme.muted }]}>{dateStr}</Text>
        <Text style={[styles.title, { color: theme.text }]}>Resumo da Corrida</Text>
      </View>

      <Card style={styles.mapCard}>
        {run.route.length > 1 ? (
          <RouteMap route={run.route} height={220} />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={{ color: theme.muted }}>Sem traçado registrado</Text>
          </View>
        )}
      </Card>

      <Card style={styles.statsCard}>
        <Text style={[styles.mainStat, { color: theme.primary }]}>
          {formatDistance(run.distanceMeters)}
        </Text>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={[styles.label, { color: theme.muted }]}>Duração</Text>
            <Text style={[styles.val, { color: theme.text }]}>
              {formatDuration(run.durationSeconds)}
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={[styles.label, { color: theme.muted }]}>Ritmo médio</Text>
            <Text style={[styles.val, { color: theme.text }]}>
              {formatPace(run.avgPaceSecPerKm)}
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={[styles.label, { color: theme.muted }]}>Calorias est.</Text>
            <Text style={[styles.val, { color: theme.text }]}>{calories} kcal</Text>
          </View>
        </View>

        {run.spotifyTrackName && (
          <View style={styles.spotifyRow}>
            <Feather name="music" size={16} color={theme.primary} />
            <Text style={[styles.spotifyText, { color: theme.text }]}>
              {run.spotifyTrackName}
            </Text>
          </View>
        )}
      </Card>

      <View style={styles.actions}>
        <Button
          title="Voltar"
          variant="secondary"
          onPress={() => router.back()}
          style={{ flex: 1 }}
        />
        <Button
          title="Apagar"
          variant="danger"
          onPress={handleDelete}
          loading={deleteMutation.isPending}
          style={{ flex: 1 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: { gap: spacing.xs },
  date: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  mapCard: { padding: 0, overflow: 'hidden' },
  mapPlaceholder: { height: 180, justifyContent: 'center', alignItems: 'center' },
  statsCard: { gap: spacing.md, alignItems: 'center' },
  mainStat: { fontSize: 48, fontWeight: '900', letterSpacing: -1 },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  gridItem: { alignItems: 'center' },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  val: { fontSize: 18, fontWeight: '800', marginTop: 2 },
  spotifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  spotifyText: { fontSize: 14, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: spacing.md },
});
