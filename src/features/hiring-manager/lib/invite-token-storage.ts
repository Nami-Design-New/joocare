const INVITE_TOKEN_STORAGE_KEY = 'hiring-manager-invite-token';
const INVITE_TOKEN_CHANGE_EVENT = 'hiring-manager:invite-token-change';
let fallbackToken: string | null = null;
let inviteSession: { token: string; queryScope: string } | null = null;

export function getInviteSession() {
  const token = getStoredInviteToken();
  if (!token) inviteSession = null;
  else if (inviteSession?.token !== token)
    inviteSession = { token, queryScope: crypto.randomUUID() };
  return inviteSession;
}

export function getStoredInviteToken(): string | null {
  if (fallbackToken) return fallbackToken;
  try {
    return window.sessionStorage.getItem(INVITE_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeInviteToken(token: string) {
  try {
    window.sessionStorage.setItem(INVITE_TOKEN_STORAGE_KEY, token);
    fallbackToken = null;
  } catch {
    fallbackToken = token;
  }
  window.dispatchEvent(new Event(INVITE_TOKEN_CHANGE_EVENT));
}

export function clearInviteToken() {
  fallbackToken = null;
  try {
    window.sessionStorage.removeItem(INVITE_TOKEN_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode / blocked site data).
  }
  window.dispatchEvent(new Event(INVITE_TOKEN_CHANGE_EVENT));
}

export function subscribeToInviteToken(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(INVITE_TOKEN_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(INVITE_TOKEN_CHANGE_EVENT, onChange);
  };
}
