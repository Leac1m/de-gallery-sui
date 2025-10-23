module degallery::data;
use std::string::String;
// use walrus::blob::Blob;

// public struct Image has drop, store {}

public struct Data has store {
    file_blob: String,
    thumbnail_blob: String,
    file_type: String, // JPEG, MP3 etc..
    end_epoch: u64,
    uploadedAt: u64,
    renewedAt: u64
}

// create
public fun create(
    file_blob: String,
    thumbnail_blob: String,
    file_type: String,
    end_epoch: u64,
    uploadedAt: u64,
    renewedAt: u64,
    ): Data {
    Data {
        file_blob,
        thumbnail_blob,
        file_type,
        end_epoch,
        uploadedAt,
        renewedAt,
    }
}