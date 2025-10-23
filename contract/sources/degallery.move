module degallery::degallery;
use std::string::String;
use sui::dynamic_field as df;
use sui::clock::Clock;
use sui::event;

use degallery::data::create;


public struct Gallery has key, store {
    id: UID,
    owner: address,
}

// ==== Events ====
public struct GalleryCreated has drop, copy {
    gallery_id: ID
}

public struct DataAdded has drop, copy {
    blob_id: String
}

// ==== new ====
public fun new(ctx: &mut TxContext): Gallery {
    let gallery = Gallery {
        id: object::new(ctx),
        owner: ctx.sender()
    };

    event::emit(
        GalleryCreated {
            gallery_id: object::id(&gallery)
        }
    );

    gallery
}

public fun add(
    gallery: &mut Gallery,
    file_blob: String,
    file_type: String,
    thumbnail_blob: String,
    end_epoch: u64,
    clock: &Clock)
    
    {
    let current_time = clock.timestamp_ms();
    let data = create(
        file_blob,
        thumbnail_blob,
        file_type,
        end_epoch,
        current_time,
        current_time,
        );

    df::add(&mut gallery.id, file_blob, data);

    event::emit(
        DataAdded {
            blob_id: file_blob
        }
    )

}
// == create
public fun seal_approve(gallery: &Gallery, ctx: &mut TxContext): bool {
    assert!(gallery.owner == ctx.sender(), 0);
    true
}