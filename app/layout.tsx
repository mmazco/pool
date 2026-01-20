import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PrivyAppProvider } from '../components/privy-provider';
import { Header } from '../components/header';

export const metadata: Metadata = {
  title: 'Fuse · Pool Demo',
  description: 'Fuse Pool demo (Next.js + Privy, mocked data)',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fuse Pool',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PrivyAppProvider>
          <Header />
          <div style={{ paddingTop: 56 }}>{children}</div>
        </PrivyAppProvider>
      </body>
    </html>
  );
}

