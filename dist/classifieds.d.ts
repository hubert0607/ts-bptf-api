import { SnapshotResponse, listingPatchRequest, ItemV2, ListingCurrencies } from './interfaces';
export declare class ClassifiedsClient {
    private readonly token;
    constructor();
    getSnapshot(sku: string): Promise<SnapshotResponse>;
    updateListing(listingId: string, update: listingPatchRequest): Promise<any>;
    deleteListing(listingId: string): Promise<any>;
    publishAll(): Promise<any>;
    archiveAll(): Promise<any>;
}
export declare class BatchClientV2 {
    private readonly token;
    private listings;
    private timer;
    constructor(autoSendTimeInterval?: number);
    private startAutoSend;
    private addListing;
    addBuyListing(item: ItemV2, currencies: ListingCurrencies, details?: string): void;
    addSellListing(itemId: number, currencies: ListingCurrencies, details?: string): void;
    private checkBatchSize;
    flush(): Promise<any>;
    private sendBatch;
}
//# sourceMappingURL=classifieds.d.ts.map