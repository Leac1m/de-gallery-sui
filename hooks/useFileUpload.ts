import React, { useState } from "react";
import { useEncryption } from "./useEncryption";
import { toHex } from "@mysten/sui/utils";
import { useGalleryClient } from "./useGalleryClient";
import { StorageInfo } from "@/app/api/upload/route";

export function useFileUpload(uploadUrl: string, encryptionConfig: { keyServerIds: string[], packageId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | undefined>(undefined);
    const galleryClient = useGalleryClient();

    const { encryptFile, error: encryptionError } = useEncryption(encryptionConfig.keyServerIds, encryptionConfig.packageId);

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_FILE_SIZE_TYPES = ["image/jpeg", "image/png", "image/gif"];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;

        if (selectedFile) {
            // check file type
            if (!ALLOWED_FILE_SIZE_TYPES.includes(selectedFile.type)) {
                setError("Only JPEG, PNG and GIF files are allowed.");
                setFile(null);
                return;
            }

            // check file size
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError("File size exceeds the 5MB limit");
                setFile(null);
                return;
            }

            // Generate thumbnail
            generateThumbnail(selectedFile);
        }
        setFile(selectedFile);
        setFileType(selectedFile?.type)
        setError(null);
    };

    const generateThumbnail = (imageFile: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (!ctx) return;

                // Set thumbnail dimensions (e.g., 150x150)
                const MAX_WIDTH = 150;
                const MAX_HEIGHT = 150;
                let width = img.width;
                let height = img.height;

                // Maintain aspect ratio
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = (height * MAX_WIDTH) / width;
                        width = MAX_WIDTH;
                    } else {
                        if (height > MAX_WIDTH) {
                            width = (width * MAX_HEIGHT) / height;
                            height = MAX_HEIGHT;
                        }
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw the resized image
                ctx.drawImage(img, 0, 0, width, height);

                // convert canvas to Base64 image
                const thumbnailBase64 = canvas.toDataURL("image/jpeg");
                setThumbnail(thumbnailBase64);
            };

            if (event.target?.result) {
                img.src = event.target.result as string;
            }
        }

        reader.readAsDataURL(imageFile);
    }

    const uploadFile = async () => {
        if (!file || !thumbnail) {
            setError("No file selected");
            return;
        }

        setIsUploading(true);
        setError(null);


        try {
            // Encrypt the original file
            const encryptedImage = await encryptFile(file, toHex(crypto.getRandomValues(new Uint8Array(9))), 2);

            if (!encryptedImage) {
                throw new Error(encryptionError || "Failed to encrypt the original file");
            }

            // Encrypt the thumbnail
            const thumbnailBlob = await (await fetch(thumbnail)).blob();
            const thumbnailFile = new File([thumbnailBlob], "thumbnail.jpg", { type: thumbnailBlob.type || "image/jpeg" });
            const encryptedThumbnail = await encryptFile(thumbnailFile, toHex(crypto.getRandomValues(new Uint8Array(9))), 2);

            if (!encryptedThumbnail) {
                throw new Error(encryptionError || "Failed to encrypt the thumbnail");
            }

            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: JSON.stringify({ image: encryptedImage.encryptedObject, thumbnail: encryptedThumbnail.encryptedObject})
            });

            if (response.status !== 200) {
                console.error(response.statusText);
            }

            const data = await response.json();

            if (!data.ok) throw new Error(data.message);

            const stroageInfo = data.storageInfo as StorageInfo[];

            if (!stroageInfo || stroageInfo.length === 0) throw new Error("Endpoint did not return storageInfo");

            await galleryClient.addImage({
                blob: stroageInfo[0].blobId,
                end_epoch: parseInt(stroageInfo[0].endEpoch),
                thumbnail: stroageInfo[1].blobId,
                type: fileType!,
            });
            
            setUploadProgress(100);
        } catch (err) {
            console.error(err)
            setError((err as Error).message);
        } finally {
            setIsUploading(false);
        }

    };

    return {
        file,
        thumbnail,
        uploadProgress,
        isUploading,
        error,
        handleFileChange,
        uploadFile,
    };

}