import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="run/active" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="run/[id]" />
    </Stack>
  );
}
