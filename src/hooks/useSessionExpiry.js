import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/apiClient';

const WARNING_MS = 2 * 60 * 1000;   // warn 2 minutes before expiry
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // auto-logout after 15 min of inactivity

/**
 * Decodes the JWT payload without verification (client-side only).
 * Verification still happens on the server for every authenticated request.
 */
function decodeJwtExp(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function useSessionExpiry({ onWarning, onExpired } = {}) {
  const { logout, refreshTokens } = useAuth();
  const warningTimerRef = useRef(null);
  const expireTimerRef = useRef(null);
  const idleTimerRef = useRef(null);

  const scheduleTimers = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const exp = decodeJwtExp(token);
    if (!exp) return;

    const now = Date.now();
    const msUntilExpiry = exp - now;

    clearTimeout(warningTimerRef.current);
    clearTimeout(expireTimerRef.current);

    const msUntilWarning = msUntilExpiry - WARNING_MS;
    if (msUntilWarning > 0) {
      warningTimerRef.current = setTimeout(() => {
        onWarning?.('Your session expires in 2 minutes. Continue browsing to stay signed in.');
      }, msUntilWarning);
    }

    if (msUntilExpiry > 0) {
      expireTimerRef.current = setTimeout(async () => {
        try {
          await refreshTokens();
          scheduleTimers(); // re-schedule with new token
        } catch {
          onExpired?.('Your session has expired. Please sign in again.');
          logout();
        }
      }, msUntilExpiry);
    }
  }, [logout, refreshTokens, onWarning, onExpired]);

  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      onExpired?.('You were signed out due to inactivity.');
      logout();
    }, IDLE_TIMEOUT_MS);
  }, [logout, onExpired]);

  useEffect(() => {
    scheduleTimers();
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));
    resetIdleTimer();

    return () => {
      clearTimeout(warningTimerRef.current);
      clearTimeout(expireTimerRef.current);
      clearTimeout(idleTimerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
    };
  }, [scheduleTimers, resetIdleTimer]);
}

/**
 * Wraps an API call and handles 401 by attempting token refresh, then retrying once.
 */
export async function withTokenRefresh(apiCall, refreshTokens, logout) {
  try {
    return await apiCall();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      try {
        await refreshTokens();
        return await apiCall(); // retry with new token
      } catch {
        logout();
        throw err;
      }
    }
    throw err;
  }
}
