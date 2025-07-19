/**
 * Root Layout Component
 * Main layout for the Flowlytix Subscription Dashboard
 * Following Instructions file standards with Material-UI integration
 */

import { type Metadata } from 'next';
import { ReactNode } from 'react';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { Navigation } from '@/components/organisms/Navigation/Navigation';
import { Box } from '@mui/material';

export const metadata: Metadata = {
  title: 'Flowlytix Dashboard | Subscription Management',
  description: 'Administrative dashboard for Flowlytix subscription management system',
  keywords: ['flowlytix', 'dashboard', 'subscription', 'management', 'admin'],
  authors: [{ name: 'Flowlytix Team' }],
  creator: 'Flowlytix Team',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'Flowlytix Dashboard',
    description: 'Administrative dashboard for subscription management',
    siteName: 'Flowlytix Dashboard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flowlytix Dashboard',
    description: 'Administrative dashboard for subscription management',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root Layout Component
 * Provides global providers and theme configuration
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#513ff2' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
