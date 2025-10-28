"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploaderProps {
  onUpload: (file: File, thumbnailUrl: string) => void;
  isUploading: boolean;
}

export function PhotoUploader({ onUpload, isUploading }: PhotoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevIsUploading = useRef(isUploading);
  const { toast } = useToast();

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
         toast({
          title: "File Too Large",
          description: "Please select an image file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (PNG, JPG, etc.).",
        variant: "destructive"
      });
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  }, []);

  const handleUploadClick = () => {
    if (selectedFile && thumbnail) {
      onUpload(selectedFile, thumbnail);
    }
  };
  
  const clearSelection = () => {
    setSelectedFile(null);
    setThumbnail(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (prevIsUploading.current && !isUploading && selectedFile) {
      // Clear selection after upload is finished
      clearSelection();
    }
    prevIsUploading.current = isUploading;
  }, [isUploading, selectedFile]);


  if (selectedFile && thumbnail) {
    return (
      <div className="relative flex flex-col md:flex-row items-center justify-center text-center p-4 gap-6">
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-2 border-primary/50 shadow-lg shrink-0">
          <Image src={thumbnail} alt="Thumbnail preview" layout="fill" objectFit="cover" />
        </div>
        <div className="text-sm text-foreground text-center md:text-left">
          <p className="font-bold break-all">{selectedFile.name}</p>
          <p className="text-muted-foreground">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
        </div>
        <div className="flex gap-4 mt-2 md:mt-0 md:ml-auto">
          <Button onClick={handleUploadClick} disabled={isUploading} className="bg-primary text-primary-foreground">
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button variant="outline" onClick={clearSelection} disabled={isUploading}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full p-8 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300",
        isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-background/80"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
      />
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <UploadCloud className="w-10 h-10 text-accent drop-shadow-glow-accent" />
        <p className="font-headline text-lg text-foreground mt-2">Drag & drop an image here</p>
        <p>or <span className="font-semibold text-primary cursor-pointer">click to browse</span></p>
        <p className="text-xs mt-2">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  );
}
