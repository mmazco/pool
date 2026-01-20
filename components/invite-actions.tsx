'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton } from './ui';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export function InviteActions({ inviteLink, poolName }: { inviteLink: string; poolName: string }) {
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();

  const message = useMemo(() => {
    return `Join my Fuse Collective Pool (${poolName}): ${inviteLink}`;
  }, [inviteLink, poolName]);

  const whatsappHref = useMemo(() => `https://wa.me/?text=${encodeURIComponent(message)}`, [message]);
  const smsHref = useMemo(() => `sms:&body=${encodeURIComponent(message)}`, [message]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <PrimaryButton
        onClick={async () => {
          await navigator.clipboard.writeText(inviteLink);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        }}
        style={{ marginTop: 0 }}
      >
        {copied ? 'Copied' : 'Copy invite link'}
      </PrimaryButton>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 8 }}>
        <a href={whatsappHref} style={{ flex: 1, textDecoration: 'none' }}>
          <SecondaryButton style={{ width: '100%' }}>Share via WhatsApp</SecondaryButton>
        </a>
        <a href={smsHref} style={{ flex: 1, textDecoration: 'none' }}>
          <SecondaryButton style={{ width: '100%' }}>Share via SMS</SecondaryButton>
        </a>
      </div>
    </div>
  );
}

