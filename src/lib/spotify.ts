import * as AuthSession from 'expo-auth-session';

export const spotifyDiscovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export const SPOTIFY_SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
];

export const spotifyClientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? '';
