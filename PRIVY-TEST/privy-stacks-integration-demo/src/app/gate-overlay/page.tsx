'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

function sanitizeRedirect(rawRedirect: string | null): string | null {
  if (!rawRedirect) return null;
  if (rawRedirect.startsWith('/')) return rawRedirect;

  try {
    const parsed = new URL(rawRedirect);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    return null;
  }

  return null;
}

function sanitizeOrigin(rawOrigin: string | null): string {
  if (!rawOrigin) return '*';
  try {
    const parsed = new URL(rawOrigin);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.origin;
    }
  } catch {
    return '*';
  }
  return '*';
}

function notifyParent(type: string, parentOrigin: string, extra?: Record<string, unknown>) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type, ...extra }, parentOrigin);
  }
}

export default function GateOverlayPage() {
  const { ready, authenticated, login, logout, user, getAccessToken } = usePrivy();
  const [resettingSession, setResettingSession] = useState(false);
  const [walletProvisioning, setWalletProvisioning] = useState(false);
  const [walletProvisioned, setWalletProvisioned] = useState(false);
  const [loginPending, setLoginPending] = useState(false);
  const [showManualLogin, setShowManualLogin] = useState(false);
  const loginAttempted = useRef(false);
  const forceResetAttempted = useRef(false);
  const walletProvisionAttempted = useRef(false);

  const { redirectTarget, parentOrigin, forceLogin, shouldAutoLogin } = useMemo(() => {
    if (typeof window === 'undefined') {
      return { redirectTarget: null, parentOrigin: '*', forceLogin: false, shouldAutoLogin: false };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      redirectTarget: sanitizeRedirect(params.get('redirect')),
      parentOrigin: sanitizeOrigin(params.get('parentOrigin')),
      forceLogin: params.get('forceLogin') === '1',
      shouldAutoLogin: params.get('autologin') === '1',
    };
  }, []);

  const startLogin = async () => {
    if (!ready || authenticated || resettingSession || loginPending) return;
    setLoginPending(true);
    setShowManualLogin(false);
    loginAttempted.current = true;
    try {
      notifyParent('STACKS_PRIVY_LOGIN_STARTED', parentOrigin);
      await login();
    } catch {
      loginAttempted.current = false;
      setLoginPending(false);
      setShowManualLogin(true);
    }
  };

  // Make body/html transparent so the parent's backdrop shows through.
  useEffect(() => {
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
    notifyParent('STACKS_PRIVY_FRAME_READY', parentOrigin);
  }, [parentOrigin]);

  useEffect(() => {
    if (!ready) return;

    if (authenticated && forceLogin && !forceResetAttempted.current) {
      forceResetAttempted.current = true;
      setResettingSession(true);
      setWalletProvisioned(false);
      walletProvisionAttempted.current = false;
      (async () => {
        try {
          await logout();
          loginAttempted.current = false;
          setLoginPending(false);
        } catch (error) {
          setShowManualLogin(true);
        } finally {
          setResettingSession(false);
        }
      })();
      return;
    }

    if (authenticated) {
      const wallets = (user?.linkedAccounts || []).filter(
        (account: any) => account?.type === 'wallet'
      );
      const hasBitcoinWallet = wallets.some(
        (account: any) => account?.chainType === 'bitcoin-segwit'
      );

      // Attempt wallet creation in the background — never block auth success.
      if (!hasBitcoinWallet && !walletProvisioned && user?.id && !walletProvisionAttempted.current && !walletProvisioning) {
        walletProvisionAttempted.current = true;
        setWalletProvisioning(true);
        notifyParent('STACKS_PRIVY_WALLET_STATUS', parentOrigin, {
          hasBitcoinWallet: false,
          walletCount: wallets.length,
          provisioning: true,
        });

        (async () => {
          try {
            const accessToken = await getAccessToken().catch(() => null);
            const response = await fetch('/api/create-wallet', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
              },
              body: JSON.stringify({
                userId: user.id,
                chainType: 'bitcoin-segwit',
              }),
            });
            const result = await response.json().catch(() => ({}));
            if (response.ok && result?.success) {
              setWalletProvisioned(true);
              notifyParent('STACKS_PRIVY_WALLET_STATUS', parentOrigin, {
                hasBitcoinWallet: true,
                walletCount: wallets.length + 1,
                created: true,
              });
            }
          } catch {
            // Wallet creation failed — not blocking login.
          } finally {
            setWalletProvisioning(false);
          }
        })();
      }

      // Proceed immediately — don't wait for wallet.
      notifyParent('STACKS_PRIVY_WALLET_STATUS', parentOrigin, {
        hasBitcoinWallet: hasBitcoinWallet || walletProvisioned,
        walletCount: wallets.length,
      });

      notifyParent('STACKS_PRIVY_AUTH_SUCCESS', parentOrigin, { redirect: redirectTarget });
      return;
    }

    if (!shouldAutoLogin || loginAttempted.current || resettingSession || loginPending) return;
    void startLogin();
  }, [authenticated, forceLogin, getAccessToken, loginPending, logout, parentOrigin, ready, redirectTarget, resettingSession, shouldAutoLogin, user?.id, user?.linkedAccounts, walletProvisioned, walletProvisioning]);

  return (
    <main
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'transparent',
      }}
    >
      {showManualLogin && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(7, 9, 14, 0.35)',
          }}
        >
          <button
            onClick={() => void startLogin()}
            style={{
              border: '1px solid rgba(255,255,255,0.7)',
              borderRadius: '999px',
              background: 'rgba(0,0,0,0.55)',
              color: '#fff',
              padding: '12px 20px',
              fontSize: '16px',
              fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
              cursor: 'pointer',
            }}
          >
            Continue with Email
          </button>
        </div>
      )}
    </main>
  );
}
