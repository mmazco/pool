'use client';

import { AuthGate } from '../../components/auth-gate';
import { NetworkDiscovery } from '../../components/network-discovery';

export default function NetworkPage() {
  return (
    <AuthGate title="Network" subtitle="Log in to discover neighbors in your energy network.">
      <NetworkDiscovery />
    </AuthGate>
  );
}
