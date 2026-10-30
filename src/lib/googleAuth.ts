import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export const authRedirectUri = AuthSession.makeRedirectUri({ scheme: 'rotafit' });

export async function signInWithGoogle(): Promise<void> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: authRedirectUri, skipBrowserRedirect: true },
  });

  if (error) throw error;
  if (!data.url) throw new Error('Não foi possível iniciar o login com o Google.');

  const result = await WebBrowser.openAuthSessionAsync(data.url, authRedirectUri);

  if (result.type !== 'success' || !result.url) {
    if (result.type === 'cancel' || result.type === 'dismiss') return;
    throw new Error('O login com o Google não foi concluído.');
  }

  const { queryParams } = Linking.parse(result.url);
  if (!queryParams) throw new Error('O Google não devolveu parâmetros válidos.');

  if (queryParams.error)
    throw new Error(String(queryParams.error_description ?? queryParams.error));

  const accessToken = queryParams.access_token as string | undefined;
  const refreshToken = queryParams.refresh_token as string | undefined;

  if (!accessToken || !refreshToken)
    throw new Error('O Google não devolveu uma sessão válida.');

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (sessionError) throw sessionError;
}
