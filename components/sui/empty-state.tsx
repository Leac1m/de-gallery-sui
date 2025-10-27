"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

interface EmptyStateProps {
  onUpload: () => void;
}

export function EmptyState({ onUpload }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <Card className="w-full max-w-2xl animate-in fade-in-50 zoom-in-95 duration-500 border-border/40">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">
            Your Gallery is Empty
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground pt-2">
            Start by uploading your first photo to the Sui network.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={onUpload} size="lg">
              <UploadCloud className="mr-2 h-5 w-5" />
              Upload Your First Photo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
