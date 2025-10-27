"use client";

import { useState } from "react";
import type { Photo } from "@/types";
import { AppHeader } from "@/components/layout/header";
import { ConnectWallet } from "@/components/sui/connect-wallet";
import { EmptyState } from "@/components/sui/empty-state";
import { PhotoGrid } from "@/components/sui/photo-grid";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { ImageFocusModal } from "@/components/sui/image-focus-modal";
import { UploadModal } from "@/components/sui/upload-modal";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    setIsConnected(true);
    // Simulate fetching existing photos from the "blockchain"
    const initialPhotos = PlaceHolderImages.map((img, index) => ({
      id: img.id,
      name: `image_${index + 1}.jpg`,
      url: img.imageUrl,
      thumbnailUrl: img.imageUrl, // For simplicity, using same url
    }));
    setPhotos(initialPhotos);
    toast({
      title: "Wallet Connected",
      description: "Successfully connected to your Sui wallet.",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setPhotos([]);
  };

  const handleUpload = (file: File, thumbnailUrl: string) => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newPhoto: Photo = {
        id: `local_${new Date().getTime()}`,
        name: file.name,
        // In a real app, this URL would come from the storage service
        url: `https://picsum.photos/seed/${new Date().getTime()}/1024/768`,
        thumbnailUrl: thumbnailUrl,
      };

      setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
      setIsUploading(false);
      setIsUploadModalOpen(false);
      toast({
        title: "Upload Complete",
        description: `${file.name} has been securely uploaded.`,
      });
    }, 2000);
  };

  const handleDelete = (photoId: string) => {
    setPhotos((prevPhotos) => prevPhotos.filter((p) => p.id !== photoId));
    toast({
      title: "Photo Deleted",
      description: "The photo has been removed.",
    });
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader
        isConnected={isConnected}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {!isConnected ? (
          <ConnectWallet onConnect={handleConnect} />
        ) : (
          <div className="space-y-8">
            {photos.length === 0 ? (
              <EmptyState onUpload={() => setIsUploadModalOpen(true)} />
            ) : (
              <PhotoGrid
                photos={photos}
                onDelete={handleDelete}
                onPhotoClick={handlePhotoClick}
              />
            )}
          </div>
        )}
      </main>

      {isConnected && (
        <>
          <UploadModal
            isOpen={isUploadModalOpen}
            onOpenChange={setIsUploadModalOpen}
            onUpload={handleUpload}
            isUploading={isUploading}
          >
            {/* This is a button that is only visible on mobile */}
            <Button
              className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg md:hidden z-50"
              size="icon"
            >
              <UploadCloud className="h-6 w-6" />
              <span className="sr-only">Upload Photo</span>
            </Button>
          </UploadModal>

          <ImageFocusModal
            isOpen={!!selectedPhoto}
            onOpenChange={(isOpen) => !isOpen && handleCloseModal()}
            photo={selectedPhoto}
          />
        </>
      )}
    </div>
  );
}
