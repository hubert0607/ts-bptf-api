import { SnapshotResponse, UpdateListingV2, BatchListing } from './interfaces';
export declare class ClassifiedsClient {
    private readonly token;
    constructor(token: string);
    getSnapshot(sku: string): Promise<SnapshotResponse>;
    updateListing(listingId: string, update: UpdateListingV2): Promise<any>;
    createBatchListings(listings: BatchListing[]): Promise<any>;
    deleteListing(listingId: string): Promise<any>;
}
//# sourceMappingURL=classifieds.d.ts.map