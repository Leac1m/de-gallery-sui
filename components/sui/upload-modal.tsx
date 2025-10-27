"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PhotoUploader } from "./photo-uploader";
import type { ReactNode } from "react";

interface UploadModalProps {
  onUpload: (file: File, thumbnailUrl: string) => void;
  isUploading: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
  children: ReactNode;
}

export function UploadModal({
  onUpload,
  isUploading,
  isOpen,
  onOpenChange,
  children,
}: UploadModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Upload a Photo
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <PhotoUploader onUpload={onUpload} isUploading={isUploading} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
