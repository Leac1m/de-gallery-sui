import { useGalleryClientContext } from '@/context/GalleryClientContext';
import React, { useEffect, useState } from 'react';

const ListImages = () => {
  const [thumbnails, setThumbnails] = useState<
    { id: string; imageUrl: string }[]
  >([]);
  const galleryClientContext = useGalleryClientContext();
  const { fetchThumbnails, gallery: gallery_id } = galleryClientContext.gallery;
  const { decryptBatch, sessionKey } = galleryClientContext.encryption;

  useEffect(() => {
    try {
      if (!gallery_id) throw Error('needs gallery id to fetch thumbnails');
      const fetchImages = async () => {
        const data = await fetchThumbnails();

        if (!data) throw new Error('No Thumbnails found');

        const images = await decryptBatch(gallery_id, data);
        console.log("Images", images)
        setThumbnails(images[0] ? images : []);
      };
      fetchImages();
    } catch (err) {
      console.log(err);
    }
  }, [gallery_id, sessionKey]);

  console.log(thumbnails, gallery_id);
  return (
    <div>
      images
      {thumbnails.map((t) => (
        <img src={t.imageUrl} alt="Image alt" key={t.id} />
      ))}
    </div>
  );
};

export default ListImages;
