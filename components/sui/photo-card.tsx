"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { Photo } from "@/types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PhotoCardProps {
  photo: Photo;
  onDelete: (id: string) => void;
  onPhotoClick: (photo: Photo) => void;
}

export function PhotoCard({ photo, onDelete, onPhotoClick }: PhotoCardProps) {
  return (
    <Card 
      className="group relative overflow-hidden rounded-lg shadow-lg bg-card border-border/20 transition-all duration-300 hover:shadow-accent/20 hover:border-accent/50 hover:-translate-y-1 cursor-pointer"
      onClick={() => onPhotoClick(photo)}
    >
      <Image
        src={photo.thumbnailUrl}
        alt={photo.name}
        width={400}
        height={300}
        className="object-cover w-full h-full aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
        data-ai-hint="abstract photo"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <p
          className="text-white font-semibold text-sm truncate"
          title={photo.name}
        >
          {photo.name}
        </p>
      </div>
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(photo.id);
        }}
        aria-label="Delete photo"
      >
        <X className="h-4 w-4" />
      </Button>
    </Card>
  );
}
