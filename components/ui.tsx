import React from 'react';

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {children}
    </main>
  );
}

export function Card({
  children,
  maxWidth = 420,
}: {
  children: React.ReactNode;
  maxWidth?: number;
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth,
        background: 'white',
        borderRadius: 16,
        border: '1px solid #e5e5e5',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '20px 16px' }}>{children}</div>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>{children}</div>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 style={{ margin: '8px 0 8px 0', fontSize: 22, fontWeight: 600, color: '#111' }}>{children}</h1>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: 0, fontSize: 14, color: '#666', lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  style,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: '100%',
        padding: '14px 16px',
        minHeight: 48,
        background: disabled ? '#999' : '#111',
        color: 'white',
        border: 'none',
        borderRadius: 8,
        fontSize: 15,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        padding: '14px 16px',
        minHeight: 48,
        background: 'white',
        color: '#111',
        border: '1px solid #e5e5e5',
        borderRadius: 8,
        fontSize: 15,
        fontWeight: 500,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

