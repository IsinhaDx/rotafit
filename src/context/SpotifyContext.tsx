import * as AuthSession from 'expo-auth-session';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { deleteSecureItem, getSecureItem, setSecureItem } from '../lib/secureStore';
import { SPOTIFY_SCOPES, spotifyClientId, spotifyDiscovery } from '../lib/spotify';
import type { SpotifyTokens } from '../types';

const STORE_KEY = 'rotafit.spotify.tokens';

interface SpotifyContextValue {
  tokens: SpotifyTokens | null;
  connecting: boolean;
  connect: () => void;
  disconnect: () => Promise<void>;
  getValidAccessToken: () => Promise<string | null>;
}

const SpotifyContext = createContext<SpotifyContextValue | undefined>(undefined);

const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'rotafit',
  path: 'spotify-auth',
});

async function saveTokens(tokens: SpotifyTokens) {
  await setSecureItem(STORE_KEY, JSON.stringify(tokens));
}

async function loadTokens(): Promise<SpotifyTokens | null> {
  const raw = await getSecureItem(STORE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SpotifyTokens;
  } catch {
    return null;
  }
}

export function SpotifyProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<SpotifyTokens | null>(null);
  const [connecting, setConnecting] = useState(false);
  const refreshing = useRef<Promise<string | null> | null>(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    { clientId: spotifyClientId, scopes: SPOTIFY_SCOPES, redirectUri, usePKCE: true },
    spotifyDiscovery,
  );

  useEffect(() => {
    loadTokens().then(setTokens);
  }, []);

  useEffect(() => {
    if (response?.type !== 'success' || !request?.codeVerifier) {
      if (response?.type === 'error' || response?.type === 'cancel') setConnecting(false);
      return;
    }

    setConnecting(true);
    AuthSession.exchangeCodeAsync(
      {
        clientId: spotifyClientId,
        code: response.params.code,
        redirectUri,
        extraParams: { code_verifier: request.codeVerifier },
      },
      spotifyDiscovery,
    )
      .then(async (result) => {
        const next: SpotifyTokens = {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken ?? '',
          expiresAt: Date.now() + (result.expiresIn ?? 3600) * 1000,
        };
        await saveTokens(next);
        setTokens(next);
      })
      .finally(() => setConnecting(false));
  }, [response, request]);

  const connect = useCallback(() => {
    setConnecting(true);
    promptAsync().catch(() => setConnecting(false));
  }, [promptAsync]);

  const disconnect = useCallback(async () => {
    await deleteSecureItem(STORE_KEY);
    setTokens(null);
  }, []);

  const getValidAccessToken = useCallback(async (): Promise<string | null> => {
    if (!tokens) return null;
    if (tokens.expiresAt - Date.now() > 60_000) return tokens.accessToken;

    if (!refreshing.current) {
      refreshing.current = AuthSession.refreshAsync(
        { clientId: spotifyClientId, refreshToken: tokens.refreshToken },
        spotifyDiscovery,
      )
        .then(async (result) => {
          const next: SpotifyTokens = {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken ?? tokens.refreshToken,
            expiresAt: Date.now() + (result.expiresIn ?? 3600) * 1000,
          };
          await saveTokens(next);
          setTokens(next);
          return next.accessToken;
        })
        .catch(async () => {
          await disconnect();
          return null;
        })
        .finally(() => {
          refreshing.current = null;
        });
    }
    return refreshing.current;
  }, [tokens, disconnect]);

  const value = useMemo(
    () => ({ tokens, connecting, connect, disconnect, getValidAccessToken }),
    [tokens, connecting, connect, disconnect, getValidAccessToken],
  );

  return <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>;
}

export function useSpotify(): SpotifyContextValue {
  const context = useContext(SpotifyContext);
  if (!context) throw new Error('useSpotify deve ser usado dentro de <SpotifyProvider>');
  return context;
}
