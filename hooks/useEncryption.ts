import AppConfig from "@/config";
import { seal_approve } from "@/lib/smc";
import { useCurrentAccount, useSignPersonalMessage, useSuiClient } from "@mysten/dapp-kit";
import { SealClient, SessionKey } from "@mysten/seal";
import { fromBase64, toBase64 } from "@mysten/sui/utils";
import { useEffect, useState } from "react";

export function useEncryption() {
    const [sealClient, setSealClient] = useState<SealClient | null>(null);
    const [sessionKey, setSessionKey] = useState<SessionKey | null>(null);
    const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
    const [error, setError] = useState<string | null>(null);
    const suiClient = useSuiClient();
    const currentAccount = useCurrentAccount();

    async function init(gallery_id: string) {
        await encryptInit();
        await decryptInit(gallery_id);
    }

    async function encryptInit() {
        try {

            const client = new SealClient({
                suiClient,
                serverConfigs: AppConfig.KEY_SERVER_IDS.map((id) => ({ objectId: id, weight: 1 })),
                verifyKeyServers: false
            });


            setSealClient(client);
        } catch (err) {
            console.error(err);
            setError("Failed to initialize SealClient");
        }
    };


    async function decryptInit(gallery: string) {
        try {
            if (!currentAccount?.address) throw new Error("Connect your wallet");

            const sessionKey = await SessionKey.create({
                address: currentAccount?.address,
                packageId: AppConfig.PACKAGE_ID,
                ttlMin: 10,
                suiClient,
            });

            const message = sessionKey.getPersonalMessage();
            const { signature } = await signPersonalMessage({ message });
            sessionKey.setPersonalMessageSignature(signature);

            setSessionKey(sessionKey);
        } catch (err) {
            console.error(err);
            setError("Failed to initialize Decrypt Client");
        }
    }

    async function encryptFile(file: File, id: string) {
        if (!sealClient) {
            setError("SealClient is not initialized");
            return null;
        }
        const fileBuffer = await file.arrayBuffer();

        try {
            const { encryptedObject, key } = await sealClient.encrypt({
                threshold: 2,
                packageId: AppConfig.PACKAGE_ID,
                id,
                data: (new Uint8Array(fileBuffer))
            });
            return { encryptedObject: toBase64(encryptedObject), backupkey: key };
        } catch (err) {
            setError((err as Error).message);
            return null;
        }
    };

    async function decryptFile(gallery: string, data: any, data_type: string) {
        if (!sealClient || !sessionKey) return

        const decryptedBytes = await sealClient.decrypt({
            data,
            sessionKey,
            txBytes: await seal_approve(gallery, suiClient),

            checkLEEncoding: false,
            checkShareConsistency: false
        });

        const copied = new Uint8Array(decryptedBytes);
        const blob = new Blob([copied], { type: data_type });

        const url = URL.createObjectURL(blob);
        return url
    }

    async function decrypt(gallery_id: string | null) {
        try {
            // get sui metadata
            if (!gallery_id) throw Error("Gallery Id not found");
            // fetch walrus blob
            const url = 'https://aggregator.walrus-testnet.walrus.space/v1/blobs/r4FqrpRSfwCSQD-1OWx79iEqtGkjS6kgSM84gv0doj0';
            const options = { method: 'GET' };

            const res = await fetch(url);
            if (!res.ok) throw new Error(`download failed: ${res.status} ${res.statusText}`);
            const ab = await res.text();
            const data = fromBase64(ab);

            const imageUrl = await decryptFile(gallery_id, data, "image/png");

            console.log("ImageUrl", imageUrl)
        } catch (error) {
            console.error(error);
        }

    }

    return {
        init,
        encryptFile,
        sessionKey,

        decrypt,
        error,
    };
}