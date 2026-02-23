'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

function sanitizeRedirect(rawRedirect: string | null): string {
  if (!rawRedirect) return '/';

  if (rawRedirect.startsWith('/')) {
    return rawRedirect;
  }

  try {
    const parsed = new URL(rawRedirect);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    return '/';
  }

  return '/';
}

export default function GateLoginPage() {
  const { ready, authenticated, login } = usePrivy();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginStarted, setLoginStarted] = useState(false);

  const redirectTarget = useMemo(() => {
    if (typeof window === 'undefined') return '/';
    const params = new URLSearchParams(window.location.search);
    return sanitizeRedirect(params.get('redirect'));
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (authenticated) {
      window.location.replace(redirectTarget);
      return;
    }

    if (loginStarted) return;

    setLoginStarted(true);
    (async () => {
      try {
        await login();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Failed to start Privy login.';
        setErrorMessage(message);
        setLoginStarted(false);
      }
    })();
  }, [authenticated, login, loginStarted, ready, redirectTarget]);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
        background: '#0b0d12',
        color: '#f7f7f8',
      }}
    >
      <div style={{ maxWidth: '560px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '10px', fontSize: '30px', fontWeight: 600 }}>
          Sign in to continue
        </h1>
        <p style={{ opacity: 0.8, marginBottom: '14px' }}>
          Completing secure wallet onboarding with Privy.
        </p>
        {!ready && <p style={{ opacity: 0.7 }}>Loading authentication...</p>}
        {ready && !authenticated && !errorMessage && (
          <p style={{ opacity: 0.7 }}>Opening Privy login...</p>
        )}
        {errorMessage && (
          <>
            <p style={{ color: '#ff8585', marginBottom: '10px' }}>
              Login could not start: {errorMessage}
            </p>
            <button
              onClick={() => {
                setErrorMessage(null);
                setLoginStarted(false);
              }}
              style={{
                border: '1px solid #f7f7f8',
                borderRadius: '999px',
                background: 'transparent',
                color: '#f7f7f8',
                padding: '10px 20px',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </>
        )}
      </div>
    </main>
  );
}
