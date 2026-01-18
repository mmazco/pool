import type { Metadata } from 'next';
import './globals.css';
import { PrivyAppProvider } from '../components/privy-provider';
import { Header } from '../components/header';

export const metadata: Metadata = {
  title: 'Fuse · Collective Pool',
  description: 'Fuse Collective Pool demo (Next.js + Privy, mocked data)',
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

