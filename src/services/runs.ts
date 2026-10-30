import { supabase } from '../lib/supabase';
import type { Run, SaveRunInput } from '../types';

interface RunRow {
  id: string;
  started_at: string;
  ended_at: string;
  distance_meters: number;
  duration_seconds: number;
  avg_pace_sec_per_km: number | null;
  route: unknown;
  spotify_track_name: string | null;
}

function toRun(row: RunRow): Run {
  return {
    id: row.id,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    distanceMeters: Number(row.distance_meters),
    durationSeconds: row.duration_seconds,
    avgPaceSecPerKm:
      row.avg_pace_sec_per_km === null ? null : Number(row.avg_pace_sec_per_km),
    route: Array.isArray(row.route) ? (row.route as Run['route']) : [],
    spotifyTrackName: row.spotify_track_name,
  };
}

export async function listRuns(): Promise<Run[]> {
  const { data, error } = await supabase
    .from('runs')
    .select('*')
    .order('started_at', { ascending: false });

  if (error) throw error;
  return (data as RunRow[]).map(toRun);
}

export async function getRun(id: string): Promise<Run | null> {
  const { data, error } = await supabase
    .from('runs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? toRun(data as RunRow) : null;
}

export async function saveRun(input: SaveRunInput): Promise<Run> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Usuário não autenticado.');

  const avgPace =
    input.distanceMeters > 0
      ? input.durationSeconds / (input.distanceMeters / 1000)
      : null;

  const { data, error } = await supabase
    .from('runs')
    .insert({
      user_id: userData.user.id,
      started_at: input.startedAt,
      ended_at: input.endedAt,
      distance_meters: input.distanceMeters,
      duration_seconds: input.durationSeconds,
      avg_pace_sec_per_km: avgPace,
      route: input.route,
      spotify_track_name: input.spotifyTrackName,
    })
    .select()
    .single();

  if (error) throw error;
  return toRun(data as RunRow);
}

export async function deleteRun(id: string): Promise<void> {
  const { error } = await supabase.from('runs').delete().eq('id', id);
  if (error) throw error;
}
