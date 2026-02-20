'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';

function sanitizeRedirect(rawRedirect: string | null): string {
  if (!rawRedirect) return '/PAGES/single-scroll.html';
  if (rawRedirect.startsWith('/')) return rawRedirect;

  try {
    const parsed = new URL(rawRedirect);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    return '/PAGES/single-scroll.html';
  }

  return '/PAGES/single-scroll.html';
}

export default function GatesLoginPage() {
  const { ready, authenticated, login, logout } = usePrivy();
  const [loginStarted, setLoginStarted] = useState(false);
  const [resettingSession, setResettingSession] = useState(false);
  const [readyTimeout, setReadyTimeout] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const forceResetAttempted = useRef(false);

  const { redirectTarget, forceLogin } = useMemo(() => {
    if (typeof window === 'undefined') return { redirectTarget: '/PAGES/single-scroll.html', forceLogin: false };
    const params = new URLSearchParams(window.location.search);
    return {
      redirectTarget: sanitizeRedirect(params.get('redirect')),
      forceLogin: params.get('forceLogin') === '1',
    };
  }, []);

  useEffect(() => {
    if (!ready || !authenticated || forceLogin) return;
    window.location.assign(redirectTarget);
  }, [authenticated, forceLogin, ready, redirectTarget]);

  useEffect(() => {
    if (!ready || !authenticated || !forceLogin || forceResetAttempted.current) return;
    forceResetAttempted.current = true;
    setResettingSession(true);

    (async () => {
      try {
        await logout();
      } finally {
        setResettingSession(false);
      }
    })();
  }, [authenticated, forceLogin, logout, ready]);

  useEffect(() => {
    if (ready) {
      setReadyTimeout(false);
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setReadyTimeout(true);
    }, 8000);
    return () => window.clearTimeout(timeoutId);
  }, [ready]);

  const handleLogin = async () => {
    if (!ready || resettingSession || loginStarted) return;
    setErrorMessage(null);
    setLoginStarted(true);
    try {
      await login();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to start Privy email login.';
      setErrorMessage(message);
      setLoginStarted(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
      }}
    >
      <section
        style={{
          width: 'min(480px, 92vw)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '36px', marginBottom: '10px', fontWeight: 600 }}>
          Sign in
        </h1>
        <p style={{ opacity: 0.75, marginBottom: '24px' }}>
          Email authentication with Bitcoin wallet creation
        </p>

        <button
          onClick={() => void handleLogin()}
          disabled={!ready || resettingSession || loginStarted}
          style={{
            width: '100%',
            borderRadius: '999px',
            border: '2px solid #fff',
            background: 'transparent',
            color: '#fff',
            padding: '14px 24px',
            fontSize: '16px',
            cursor: !ready || resettingSession || loginStarted ? 'not-allowed' : 'pointer',
            opacity: !ready || resettingSession || loginStarted ? 0.6 : 1,
          }}
        >
          Login with Email
        </button>

        <p style={{ marginTop: '14px', fontSize: '13px', opacity: 0.6 }}>
          {!ready
            ? (readyTimeout ? 'Privy is taking too long to initialize. Refresh and try again.' : 'Loading login...')
            : resettingSession
              ? 'Preparing secure login...'
              : loginStarted
                ? 'Opening Privy...'
                : 'You will receive an OTP code by email.'}
        </p>
        {errorMessage && (
          <p style={{ marginTop: '8px', fontSize: '13px', color: '#ff9a9a' }}>
            {errorMessage}
          </p>
        )}
      </section>
    </main>
  );
}
