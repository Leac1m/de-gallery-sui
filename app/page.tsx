'use client';

import { useState, useEffect, useCallback } from 'react';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

export default function Home() {
  // const [isConnected, setIsConnected] = useState(false);
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { toast } = useToast();
  const galleryClientContext = useGalleryClientContext();
  const {
    fileUpload,
    gallery: galleryClient,
    encryption,
  } = galleryClientContext;

  const isConnected = !!currentAccount?.address;
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
    disconnect();
    setPhotos([]);
  };

  // Load photos from on-chain gallery when connected and gallery is initialized
  const loadImages = useCallback(async () => {
    if (!isConnected) return;
    if (!galleryClient?.gallery) return;

    // Wait for the encryption session key to be created before fetching/decrypting thumbnails
    if (!encryption.sessionKey) {
      setIsUnlocking(true);
      return;
    }

    setIsUnlocking(false);
    setFetchError(null);

    try {
      const fetched = await galleryClient.fetchThumbnails();
      if (!fetched) return;

      setIsFetching(true);

      const images = await encryption.decryptBatch(galleryClient.gallery, fetched);

      // decryptBatch may return an array of { id, imageUrl }
      const parsed = (images || []).map((img: any, idx: number) => ({
        id: img?.id ?? `photo_${idx}`,
        name: img?.id ?? `photo_${idx}`,
        url: img?.imageUrl ?? img?.imageUrl,
        thumbnailUrl: img?.imageUrl ?? '',
      }));

      setPhotos(parsed);
    } catch (err) {
      console.error(err);
      setFetchError((err as Error)?.message ?? 'Failed to fetch/decrypt images');
    } finally {
      setIsFetching(false);
    }
  }, [isConnected, galleryClient?.gallery, encryption.sessionKey, galleryClient, encryption]);

  useEffect(() => {
    let mounted = true;
    // call loader (it has guards)
    loadImages();

    return () => {
      mounted = false;
    };
  }, [loadImages]);

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
      <main className="grow container mx-auto px-4 py-8 md:py-12">
        {!isConnected ? (
          <ConnectWallet />
        ) : (
          <div className="space-y-8">
            {photos.length === 0 ? (
              isUnlocking ? (
                <Card className="max-w-xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Unlocking images
                    </CardTitle>
                    <CardDescription>
                      Establishing a secure session to decrypt your gallery.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This may take a few seconds — please approve any signature
                      requests in your wallet if prompted.
                    </p>
                  </CardContent>
                </Card>
              ) : fetchError ? (
                <Card className="max-w-xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-destructive">Failed to load images</CardTitle>
                    <CardDescription>
                      There was an error fetching or decrypting your gallery.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">{fetchError}</p>
                    <div className="flex gap-2">
                      <Button onClick={() => loadImages()} className="bg-primary">Retry</Button>
                      <Button variant="outline" onClick={() => setFetchError(null)}>Dismiss</Button>
                    </div>
                  </CardContent>
                </Card>
              ) : isFetching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-lg overflow-hidden bg-muted/20 h-48" />
                  ))}
                </div>
              ) : (
                <EmptyState onUpload={() => setIsUploadModalOpen(true)} />
              )
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
