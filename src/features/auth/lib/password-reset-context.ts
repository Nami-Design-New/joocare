"use client";

import { PasswordResetRole } from "./password-reset";

type PasswordResetContext = {
  email: string;
  otp: string;
  role: PasswordResetRole;
};

const COOKIE_PREFIX = "joo_reset_";
const COOKIE_MAX_AGE = 60 * 10;

function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

function getCookie(name: string) {
  const prefix = `${name}=`;
  const cookies = document.cookie.split("; ");
  const match = cookies.find((cookie) => cookie.startsWith(prefix));

  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function setPasswordResetContext(context: PasswordResetContext) {
  setCookie(`${COOKIE_PREFIX}email`, context.email);
  setCookie(`${COOKIE_PREFIX}otp`, context.otp);
  setCookie(`${COOKIE_PREFIX}role`, context.role);
}

export function getPasswordResetContext(): PasswordResetContext | null {
  const email = getCookie(`${COOKIE_PREFIX}email`);
  const otp = getCookie(`${COOKIE_PREFIX}otp`);
  const role = getCookie(`${COOKIE_PREFIX}role`) as PasswordResetRole | null;

  if (!email || !otp || !role) {
    return null;
  }

  return {
    email,
    otp,
    role,
  };
}

export function clearPasswordResetContext() {
  deleteCookie(`${COOKIE_PREFIX}email`);
  deleteCookie(`${COOKIE_PREFIX}otp`);
  deleteCookie(`${COOKIE_PREFIX}role`);
}
