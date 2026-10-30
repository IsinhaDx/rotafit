import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { GlassSurface } from '../../../src/components/glass/GlassSurface';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
          height: 60,
        },
        tabBarBackground: () => (
          <GlassSurface
            radius={0}
            intensity={50}
            style={{ width: '100%', height: '100%' }}
          >
            <></>
          </GlassSurface>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={String(color)} />
          ),
        }}
      />
    </Tabs>
  );
}
