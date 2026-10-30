import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSpotify } from '../../context/SpotifyContext';
import {
  useNowPlaying,
  usePausePlayback,
  useResumePlayback,
  useSkipNext,
  useSkipPrevious,
} from '../../hooks/useSpotifyPlayer';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing } from '../../theme/tokens';
import { Button } from '../Button';
import { Card } from '../Card';

export function SpotifyPlayerCard() {
  const { theme } = useTheme();
  const { tokens, connect } = useSpotify();
  const { data: track } = useNowPlaying();

  const pause = usePausePlayback();
  const resume = useResumePlayback();
  const next = useSkipNext();
  const prev = useSkipPrevious();

  if (!tokens) {
    return (
      <Card>
        <View style={styles.connectRow}>
          <Feather name="music" size={24} color={theme.primary} />
          <View style={styles.flex}>
            <Text style={[styles.title, { color: theme.text }]}>Spotify</Text>

            <Text style={[styles.sub, { color: theme.muted }]}>
              Conecte para ouvir e controlar corridas.
            </Text>
          </View>
          <Button title="Conectar" onPress={connect} variant="secondary" />
        </View>
      </Card>
    );
  }

  if (!track) {
    return (
      <Card>
        <View style={styles.connectRow}>
          <Feather name="disc" size={24} color={theme.muted} />
          <Text style={[styles.sub, { color: theme.muted }]}>
            Nenhuma música tocando no Spotify agora.
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.trackRow}>
        {track.albumArt ? (
          <Image source={{ uri: track.albumArt }} style={styles.art} />
        ) : (
          <View style={[styles.artPlaceholder, { backgroundColor: theme.surface }]}>
            <Feather name="music" size={20} color={theme.muted} />
          </View>
        )}
        <View style={styles.flex}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {track.name}
          </Text>
          <Text style={[styles.sub, { color: theme.muted }]} numberOfLines={1}>
            {track.artist}
          </Text>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={() => prev.mutate()} disabled={prev.isPending}>
          <Feather name="skip-back" size={22} color={theme.text} />
        </TouchableOpacity>

        {track.isPlaying ? (
          <TouchableOpacity onPress={() => pause.mutate()} disabled={pause.isPending}>
            <Feather name="pause-circle" size={32} color={theme.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => resume.mutate()} disabled={resume.isPending}>
            <Feather name="play-circle" size={32} color={theme.primary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => next.mutate()} disabled={next.isPending}>
          <Feather name="skip-forward" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  connectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  art: { width: 48, height: 48, borderRadius: radius.sm },
  artPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700' },
  sub: { fontSize: 13 },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.xs,
  },
});
