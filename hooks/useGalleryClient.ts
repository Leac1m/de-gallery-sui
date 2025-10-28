import { addToGallery, fetchDynamicFields, getGallery, newGallery } from "@/lib/smc";
import { DataValue } from "@/lib/types";
import { useCurrentAccount, useSignTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";


export function useGalleryClient() {
    const suiClient = useSuiClient();
    const currentAccount = useCurrentAccount();
    const { mutate: signTransaction } = useSignTransaction();

    const [gallery, setGallery] = useState<string | null>(null);
    const [images, setImages] = useState<DataValue[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    // check if user has gallery else get one

    async function init() {
        try {
            setError(null);
            if (!currentAccount?.address) throw new Error("User needs to connect to wallet first");

            const currentGallery = await getGallery(suiClient, currentAccount.address);

            if (currentGallery) {
                setGallery(currentGallery);
            } else {
                const result = await signAndExcute(newGallery(currentAccount.address))

                const firstEvent = result?.events?.[0];
                const galleryId = firstEvent && (firstEvent.parsedJson as { gallery_id?: string })?.gallery_id;

                if (galleryId) {
                    setGallery(galleryId);
                }
            }
        } catch (e) {
            console.log(e)
            setError((e as Error).message)
        }
    };

    async function fetchThumbnails() {
        try {
            if (!gallery) throw new Error("Gallery asset not Found");
            const data = await fetchDynamicFields({ id: gallery })
            const fetchedImages = data.address.dynamicFields.nodes
                .map(node => node.value.json)
                .filter((v): v is DataValue => v !== undefined);

            if (fetchedImages.length === 0) throw new Error("Image fetch failed");

            return fetchedImages;
        } catch (e) {
            console.error(e);
            setError((e as Error).message);
        }
    }


    async function addImage(fileData: { blob: string; type: string; thumbnail: string; end_epoch: number; }) {
        try {
            checkGallery();

            const tx = addToGallery(gallery!, fileData);

            const result = await signAndExcute(tx);
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function signAndExcute(transaction: Transaction) {
        const signTx: {
            bytes: string;
            signature: string;
        } = await new Promise((resolve, reject) => {
            signTransaction({
                transaction,
            }, {
                onSuccess: resolve,
                onError: reject
            });
        });

        return await suiClient.executeTransactionBlock({
            transactionBlock: signTx.bytes,
            signature: signTx.signature,
            options: { showEvents: true }
        });
    }

    function checkGallery() {
        setError(null);
        if (!gallery) throw new Error("Gallery asset not Found");

    }

    return { init, gallery, images, addImage, fetchThumbnails };
}