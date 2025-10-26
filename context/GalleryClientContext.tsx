import { useEncryption } from "@/hooks/useEncryption";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useGalleryClient } from "@/hooks/useGalleryClient";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { createContext, useContext, useEffect, useState } from "react";

const GalleryClientContext = createContext<{
    gallery: ReturnType<typeof useGalleryClient>;
    encryption: ReturnType<typeof useEncryption>;
    fileUpload: ReturnType<typeof useFileUpload>;
} | null>(null);

export const GalleryClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const encryption = useEncryption();
    const gallery = useGalleryClient();
    const fileUpload = useFileUpload(gallery, encryption);
    const currentAccount = useCurrentAccount()

    // Initializer
    useEffect(() => {
        try {
            async function init() {
                await gallery.init();
                if (!gallery.gallery) return;
            
                await encryption.init(gallery.gallery);
            }

            init();
        } catch(err) {
            console.log(err);
        }
    }, [currentAccount?.address, gallery.gallery]);


    return (
        <GalleryClientContext.Provider value={{gallery, encryption, fileUpload}}>
            {children}
        </GalleryClientContext.Provider>
    );
};

export function useGalleryClientContext() {
    const context = useContext(GalleryClientContext);
    if (!context) throw new Error("useGalleryClientContext must be used within a GalleryClientProvider");

    return context;
}