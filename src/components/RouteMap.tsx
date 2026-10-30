import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import type { RoutePoint } from '../types';

interface RouteMapProps {
  route: RoutePoint[];
  height?: number;
}

export function RouteMap({ route, height = 220 }: RouteMapProps) {
  const { theme } = useTheme();

  const svgData = useMemo(() => {
    if (route.length < 2) return null;

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    for (const p of route) {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
    }

    const padLat = (maxLat - minLat) * 0.1 || 0.001;
    const padLng = (maxLng - minLng) * 0.1 || 0.001;

    minLat -= padLat;
    maxLat += padLat;
    minLng -= padLng;
    maxLng += padLng;

    const width = 300;
    const h = height;

    const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * width;
    const toY = (lat: number) => h - ((lat - minLat) / (maxLat - minLat)) * h;

    const d = route.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${toX(p.lng)} ${toY(p.lat)}`,
      '',
    );

    const start = { x: toX(route[0].lng), y: toY(route[0].lat) };
    const end = {
      x: toX(route[route.length - 1].lng),
      y: toY(route[route.length - 1].lat),
    };

    return { d, start, end, width, height: h };
  }, [route, height]);

  if (!svgData) return null;

  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${svgData.width} ${svgData.height}`}>
        <Path
          d={svgData.d}
          stroke={theme.primary}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={svgData.start.x} cy={svgData.start.y} r={6} fill={theme.success} />
        <Circle cx={svgData.end.x} cy={svgData.end.y} r={6} fill={theme.danger} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
