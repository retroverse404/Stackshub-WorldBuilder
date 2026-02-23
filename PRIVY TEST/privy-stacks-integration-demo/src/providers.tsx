'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function Providers({children}: {children: React.ReactNode}) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          background: '#07090e',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{maxWidth: 560, lineHeight: 1.5}}>
          <h1 style={{margin: '0 0 10px', fontSize: 24}}>Privy is not configured</h1>
          <p style={{margin: 0, opacity: 0.85}}>
            Missing <code>NEXT_PUBLIC_PRIVY_APP_ID</code> in the Next app environment. The login UI
            cannot load until this is set.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
