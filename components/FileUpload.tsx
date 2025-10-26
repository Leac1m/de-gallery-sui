import { useGalleryClientContext } from "@/context/GalleryClientContext";

export default function FileUpload() {
    const {
        file,
        thumbnail,
        uploadProgress,
        isUploading,
        error,
        handleFileChange,
        uploadFile,
    } = (useGalleryClientContext()).fileUpload;

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {file && <p>Selected file: {file.name}</p>}
            {thumbnail && (
                <div className="">
                    <p>Thumbnail:</p>
                    <img src={thumbnail} alt="Thumbnail" className='w-[150px] h-[150px]'/>
                </div>
            )}
            {error && <p className='text-red-700'>{error}</p>}
            <button onClick={uploadFile} disabled={isUploading || !file}>
                {isUploading ? "Uploading...": "Upload"}
            </button>
            {isUploading && <p>Progress: {uploadProgress}</p>}
        </div>
    )
}