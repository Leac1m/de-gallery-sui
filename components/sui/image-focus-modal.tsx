"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import type { Photo } from "@/types";

interface ImageFocusModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  photo: Photo | null;
}

export function ImageFocusModal({
  isOpen,
  onOpenChange,
  photo,
}: ImageFocusModalProps) {
  if (!photo) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 bg-transparent border-0">
          <DialogTitle className="sr-only">{photo.name}</DialogTitle>
          <div className="relative aspect-video w-full">
            <Image
              src={photo.url}
              alt={photo.name}
              fill
              className="object-contain"
            />
          </div>
      </DialogContent>
    </Dialog>
  );
}
