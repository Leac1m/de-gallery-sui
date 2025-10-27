"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface ConnectWalletProps {
  onConnect: () => void;
}

export function ConnectWallet({ onConnect }: ConnectWalletProps) {
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
            To begin using De-Gallery, please connect your Sui-compatible wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onConnect}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
          >
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
