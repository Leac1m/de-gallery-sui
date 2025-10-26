"use client"
import FileUpload from "@/components/FileUpload";
import ListImages from "@/components/ListImages";
import { useGalleryClientContext } from "@/context/GalleryClientContext";
import { ConnectButton } from "@mysten/dapp-kit";

export default function Home() {
  // const galleryClientContext = useGalleryClientContext()
  // const gallery_id = galleryClientContext.gallery.gallery;
  // const decrypt = galleryClientContext.encryption.decrypt;
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <ConnectButton />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <FileUpload ></FileUpload>
        {/* <button onClick={() => decrypt(gallery_id)}>decrypt</button> */}
        <ListImages />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
