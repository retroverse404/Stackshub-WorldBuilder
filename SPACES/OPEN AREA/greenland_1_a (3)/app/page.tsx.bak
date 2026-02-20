'use client';

import { useCallback, useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline/next';
import type { Application } from '@splinetool/runtime';

export default function Home() {
  const [sceneVersion, setSceneVersion] = useState(0);

  const resetView = useCallback(() => {
    setSceneVersion((v) => v + 1);
  }, []);

  const handleLoad = useCallback((app: Application) => {
    const blockingPngCandidates = ['Object_4', 'windows_file_folder'];
    for (const name of blockingPngCandidates) {
      const obj = app.findObjectByName(name);
      if (obj) {
        obj.visible = false;
      }
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        resetView();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [resetView]);

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Spline
        key={sceneVersion}
        scene="/scene.splinecode"
        wasmPath="/"
        onLoad={handleLoad}
      />

      <button
        type="button"
        onClick={resetView}
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
          padding: '10px 14px',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.35)',
          background: 'rgba(10,10,10,0.7)',
          color: '#fff',
          fontSize: 14,
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
        }}
      >
        Exit Agent View
      </button>
    </main>
  );
}
