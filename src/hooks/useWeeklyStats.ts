import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface WeeklyStats {
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  runCount: number;
}

export function useWeeklyStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['weekly-stats', user?.id],
    queryFn: async (): Promise<WeeklyStats> => {
      const { data, error } = await supabase.rpc('weekly_stats');
      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : data;
      return {
        totalDistanceMeters: Number(row?.total_distance_meters ?? 0),
        totalDurationSeconds: Number(row?.total_duration_seconds ?? 0),
        runCount: Number(row?.run_count ?? 0),
      };
    },
    enabled: Boolean(user),
  });
}
