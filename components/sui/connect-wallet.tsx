'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ConnectButton } from '@mysten/dapp-kit';
import { Wallet } from 'lucide-react';


export function ConnectWallet() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <Card className="w-full max-w-md text-center animate-in fade-in-50 zoom-in-95 duration-500 border-border/40">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4 border border-primary/20">
            <Wallet className="h-12 w-12 text-primary drop-shadow-glow-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">
            Connect Your Wallet
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground pt-2">
            To begin using De-Gallery, please connect your Sui-compatible
            wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectButton
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
          />
        </CardContent>
      </Card>
    </div>
  );
}
