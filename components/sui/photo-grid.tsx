"use client";

import type { Photo } from "@/types";
import { PhotoCard } from "./photo-card";

interface PhotoGridProps {
  photos: Photo[];
  onDelete: (id: string) => void;
  onPhotoClick: (photo: Photo) => void;
}

export function PhotoGrid({ photos, onDelete, onPhotoClick }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className="animate-in fade-in-50 zoom-in-95"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <PhotoCard photo={photo} onDelete={onDelete} onPhotoClick={onPhotoClick} />
        </div>
      ))}
    </div>
  );
}
