import { storeBlob } from "@/lib/utils";
import { NextResponse } from "next/server";
import * as z from "zod";

export interface StorageInfo {
    blobId: string;
    endEpoch: string;
}[]

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const ImageData = z.object({
            image: z.string(),
            thumbnail: z.string()
        });

        const result = ImageData.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ ok: false, message: result.error.message }, { status: 401 });
        }

        const { image, thumbnail } = result.data

        // Upload both encrypted files
        const storageInfo: StorageInfo[] = [];

        // Upload both blobs in parallel
        const [fileInfo, thumbnailInfo] = await Promise.all([
            storeBlob(image),
            storeBlob(thumbnail),
        ]);

        storageInfo.push(fileInfo, thumbnailInfo);

        return NextResponse.json({
            ok: true,
            storageInfo,
        });
    } catch (err) {
        return NextResponse.json({ ok: false, message: (err as Error).message })

    }
}