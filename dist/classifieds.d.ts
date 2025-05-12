import { SnapshotResponse, UpdateListingV2, BatchListing } from './interfaces';
export declare class ClassifiedsClient {
    private readonly token;
    constructor();
    getSnapshot(sku: string): Promise<SnapshotResponse>;
    updateListing(listingId: string, update: UpdateListingV2): Promise<any>;
    deleteListing(listingId: string): Promise<any>;
}
export declare class BatchClient {
    private readonly token;
    private listings;
    private timer;
    constructor();
    private startAutoSend;
    addListing(listing: BatchListing): void;
    private checkBatchSize;
    flush(): Promise<void>;
    private sendBatch;
}
//# sourceMappingURL=classifieds.d.ts.map