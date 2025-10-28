'use client';

import { useState } from 'react';
import type { Photo } from '@/types';
import { AppHeader } from '@/components/layout/header';
import { ConnectWallet } from '@/components/sui/connect-wallet';
import { EmptyState } from '@/components/sui/empty-state';
import { PhotoGrid } from '@/components/sui/photo-grid';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { useGalleryClientContext } from '@/context/GalleryClientContext';
import { ImageFocusModal } from '@/components/sui/image-focus-modal';
import { UploadModal } from '@/components/sui/upload-modal';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';

export default function Home() {
  // const [isConnected, setIsConnected] = useState(false);
  const currentAccount = useCurrentAccount();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { toast } = useToast();
  const { fileUpload } = useGalleryClientContext();

  const isConnected = !!currentAccount?.address;

  const handleConnect = () => {
    // Simulate fetching existing photos from the "blockchain"
    const initialPhotos = PlaceHolderImages.map((img, index) => ({
      id: img.id,
      name: `image_${index + 1}.jpg`,
      url: img.imageUrl,
      thumbnailUrl: img.imageUrl, // For simplicity, using same url
    }));
    setPhotos(initialPhotos);
    toast({
      title: 'Wallet Connected',
      description: 'Successfully connected to your Sui wallet.',
    });
  };

  const handleDisconnect = () => {
    setPhotos([]);
  };

  const handleUpload = (file: File, thumbnailUrl: string) => {
    setIsUploading(true);

    (async () => {
      try {
        await fileUpload.uploadFile(file, thumbnailUrl);

        // Optimistically add the photo to UI while the gallery backend will hold the canonical record
        const newPhoto: Photo = {
          id: `local_${new Date().getTime()}`,
          name: file.name,
          url: `https://picsum.photos/seed/${new Date().getTime()}/1024/768`,
          thumbnailUrl: thumbnailUrl,
        };

        setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
        toast({
          title: 'Upload Complete',
          description: `${file.name} has been securely uploaded.`,
        });
      } catch (err) {
        toast({
          title: 'Upload Failed',
          description: (err as Error).message || 'Failed to upload the photo.',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
        setIsUploadModalOpen(false);
      }
    })();
  };

  const handleDelete = (photoId: string) => {
    setPhotos((prevPhotos) => prevPhotos.filter((p) => p.id !== photoId));
    toast({
      title: 'Photo Deleted',
      description: 'The photo has been removed.',
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
        onDisconnect={handleDisconnect}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {!isConnected ? (
          <ConnectWallet />
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
