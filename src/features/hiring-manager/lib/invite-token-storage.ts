const INVITE_TOKEN_STORAGE_KEY = 'hiring-manager-invite-token';

export function getStoredInviteToken(): string | null {
  try {
    return window.sessionStorage.getItem(INVITE_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeInviteToken(token: string) {
  try {
    window.sessionStorage.setItem(INVITE_TOKEN_STORAGE_KEY, token);
  } catch {
    // Storage can be unavailable (private mode / blocked site data).
  }
}

export function clearInviteToken() {
  try {
    window.sessionStorage.removeItem(INVITE_TOKEN_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode / blocked site data).
  }
}

export function subscribeToInviteToken(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}
