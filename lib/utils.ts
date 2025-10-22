import AppConfig, { getPublisherUrl } from "@/config";

export const storeBlob = async (encryptedData: string) => {
    const url = getPublisherUrl(`/v1/blobs?epochs=${AppConfig.NUM_EPOCH}`);
    const response = await fetch(url, {
        method: 'PUT',
        body:  encryptedData,
    });

    if (response.status !== 200) {
        throw new Error('Something went wrong when storing the blob!');
    }

    return displayUpload(await response.json());
};

export const displayUpload = (storage_info: any) => {
    let info;
    if ('alreadyCertified' in storage_info) {
      info = {
        status: 'Already certified',
        blobId: storage_info.alreadyCertified.blobId,
        startEpoch: storage_info.newlyCreated.blobObject.storage.startEpoch,
        endEpoch: storage_info.alreadyCertified.storage.endEpoch,
      };
    } else if ('newlyCreated' in storage_info) {
      info = {
        status: 'Newly created',
        blobId: storage_info.newlyCreated.blobObject.blobId,
        startEpoch: storage_info.newlyCreated.blobObject.storage.startEpoch,
        endEpoch: storage_info.newlyCreated.blobObject.storage.endEpoch,
      };
    } else {
      throw Error('Unhandled successful response!');
    }
    return info;
  };