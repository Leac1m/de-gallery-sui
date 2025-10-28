'use client';

import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import '@mysten/dapp-kit/dist/index.css';
import { GalleryClientProvider } from '@/context/GalleryClientContext';
import { darkTheme, lightTheme } from './theme-dapp';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider
          theme={[
            { selector: 'html:not(.dark)', variables: lightTheme },
            { selector: 'html.dark', variables: darkTheme },
          ]}
        >
          <GalleryClientProvider>{children}</GalleryClientProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
