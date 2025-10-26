import { useGalleryClientContext } from '@/context/GalleryClientContext';
import React, { useEffect } from 'react'

const ListImages = () => {

    const {gallery, getImages, images } = (useGalleryClientContext()).gallery;

    useEffect(() => {
        if (!gallery) return;
            const fetchImages = async () => {
                await getImages();
            };
            fetchImages();

    }, [gallery])

    console.log(images, gallery);
  return (
    <div>ListImages</div>
  )
}

export default ListImages