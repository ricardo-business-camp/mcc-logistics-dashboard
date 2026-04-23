import React from 'react';

export default function App() {
  return (
    <div style={{
      background: '#1a1a1a',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: '#00cc00',
    }}>
      <div style={{ fontSize: 'clamp(14px, 3vw, 48px)', fontWeight: 'bold', letterSpacing: '0.15em' }}>
        SYSTEM OFFLINE
      </div>
      <div style={{ marginTop: '1.2em', fontSize: 'clamp(10px, 1.4vw, 22px)', color: '#555', letterSpacing: '0.08em' }}>
        Back online shortly.
      </div>
    </div>
  );
}
