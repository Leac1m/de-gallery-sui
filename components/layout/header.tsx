"use client";

import { Button } from "@/components/ui/button";
import { Wallet, Unplug, UploadCloud } from "lucide-react";

interface AppHeaderProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onUploadClick: () => void;
}

export function AppHeader({
  isConnected,
  onConnect,
  onDisconnect,
  onUploadClick,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <div className="mr-4 flex items-center">
          <a href="#" className="flex items-center gap-2">
            <span className="font-headline text-xl font-bold text-foreground">
              De-Gallery
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <Button variant="outline" onClick={onUploadClick}>
                  <UploadCloud className="mr-2" />
                  Upload
                </Button>
              </div>
              <Button
                onClick={onDisconnect}
                variant="outline"
                className="border-accent/50 text-accent hover:bg-accent/10 hover:text-accent hover:border-accent transition-all duration-300"
              >
                <Unplug className="mr-2 h-4 w-4" /> Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={onConnect}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
            >
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
