import { useSuiClient } from "@mysten/dapp-kit";
import { SealClient } from "@mysten/seal";
import { toBase64 } from "@mysten/sui/utils";
import { useEffect, useState } from "react";

export function useEncryption(keyServerIds: string[], packageId: string) {
    const [sealClient, setSealClient] = useState<SealClient | null>(null);
    const [error, setError] = useState<string | null>(null);
    const suiClient = useSuiClient();

    useEffect(() => {
        const initializeSealClient = () => {
            try {
                const client = new SealClient({
                    suiClient,
                    serverConfigs: keyServerIds.map((id) => ({ objectId: id, weight: 1 })),
                    verifyKeyServers: false
                });
                setSealClient(client);
            } catch (err) {
                console.error(err);
                setError("Failed to initialize SealClient");
            }
        };

        initializeSealClient();
    }, [keyServerIds, suiClient]);

    const encryptFile = async (file: File, id: string, threshold: number) => {
        if (!sealClient) {
            setError("SealClient is not initialized");
            return null;
        }
        const fileBuffer = await file.arrayBuffer();

        try {
            const { encryptedObject, key } = await sealClient.encrypt({
                threshold,
                packageId,
                id,
                data: (new Uint8Array(fileBuffer))
            });
            return { encryptedObject: toBase64(encryptedObject), backupkey: key };
        } catch (err) {
            setError((err as Error).message);
            return null;
        }
    };

    return {
        encryptFile,
        error,
    };
}