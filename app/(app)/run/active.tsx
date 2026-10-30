import { Feather } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../src/components/Button';
import { Card } from '../../../src/components/Card';
import { RouteMap } from '../../../src/components/RouteMap';
import { useNowPlaying } from '../../../src/hooks/useSpotifyPlayer';
import { useRunTracker } from '../../../src/hooks/useRunTracker';
import { queryClient } from '../../../src/lib/queryClient';
import { saveRun } from '../../../src/services/runs';
import { useTheme } from '../../../src/theme/ThemeContext';
import { radius, spacing } from '../../../src/theme/tokens';
import { formatDistance, formatDuration, formatPace } from '../../../src/utils/geo';

export default function ActiveRunScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const tracker = useRunTracker();
  const { data: track } = useNowPlaying();
  const [saving, setSaving] = useState(false);

  const saveMutation = useMutation({
    mutationFn: saveRun,
    onSuccess: (savedRun) => {
      void queryClient.invalidateQueries({ queryKey: ['weekly-stats'] });
      void queryClient.invalidateQueries({ queryKey: ['runs'] });
      router.replace(`/run/${savedRun.id}`);
    },
    onError: (err: Error) => {
      Alert.alert('Erro ao salvar corrida', err.message);
      setSaving(false);
    },
  });

  const handleFinish = () => {
    Alert.alert('Finalizar corrida', 'Deseja realmente encerrar este treino?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Finalizar',
        style: 'destructive',
        onPress: () => {
          setSaving(true);
          const input = tracker.finish(track?.name ?? null);
          if (!input) {
            Alert.alert('Erro', 'Corrida inválida.');
            setSaving(false);
            return;
          }
          saveMutation.mutate(input);
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.statusTag, { color: theme.primary }]}>
          {tracker.status === 'idle'
            ? 'PRONTO'
            : tracker.status === 'active'
              ? 'EM ANDAMENTO'
              : tracker.status === 'paused'
                ? 'PAUSADO'
                : 'FINALIZADO'}
        </Text>
      </View>

      <Card style={styles.metricsCard}>
        <Text style={[styles.mainMetric, { color: theme.text }]}>
          {formatDistance(tracker.distanceMeters)}
        </Text>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={[styles.gridLabel, { color: theme.muted }]}>Tempo</Text>
            <Text style={[styles.gridValue, { color: theme.text }]}>
              {formatDuration(tracker.durationSeconds)}
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={[styles.gridLabel, { color: theme.muted }]}>Ritmo</Text>
            <Text style={[styles.gridValue, { color: theme.text }]}>
              {formatPace(tracker.currentPaceSecPerKm)}
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.mapContainer}>
        {tracker.route.length > 1 ? (
          <RouteMap route={tracker.route} height={180} />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Feather name="navigation" size={32} color={theme.muted} />
            <Text style={{ color: theme.muted, marginTop: spacing.xs }}>
              Aguardando GPS...
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {tracker.status === 'idle' && (
          <Button title="COMEÇAR" onPress={() => void tracker.start()} />
        )}

        {tracker.status === 'active' && (
          <View style={styles.buttonRow}>
            <Button
              title="Pausar"
              variant="secondary"
              onPress={tracker.pause}
              style={{ flex: 1 }}
            />
            <Button
              title="Finalizar"
              variant="danger"
              onPress={handleFinish}
              loading={saving}
              style={{ flex: 1 }}
            />
          </View>
        )}

        {tracker.status === 'paused' && (
          <View style={styles.buttonRow}>
            <Button
              title="Retomar"
              onPress={() => void tracker.resume()}
              style={{ flex: 1 }}
            />
            <Button
              title="Finalizar"
              variant="danger"
              onPress={handleFinish}
              loading={saving}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, paddingTop: spacing.xl * 2 },
  header: { alignItems: 'center', marginBottom: spacing.md },
  statusTag: { fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  metricsCard: { alignItems: 'center', paddingVertical: spacing.lg },
  mainMetric: { fontSize: 52, fontWeight: '900', letterSpacing: -1 },
  grid: {
    flexDirection: 'row',
    gap: spacing.xl * 2,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  gridItem: { alignItems: 'center' },
  gridLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  gridValue: { fontSize: 20, fontWeight: '800', marginTop: 2 },
  mapContainer: { flex: 1, justifyContent: 'center', marginVertical: spacing.md },
  mapPlaceholder: { alignItems: 'center', justifyContent: 'center', height: 180 },
  actions: { marginBottom: spacing.lg },
  buttonRow: { flexDirection: 'row', gap: spacing.md },
});
