import { ItemV2, ListingCurrencies } from './interfaces/batch';
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
    destroy(): void;
}
//# sourceMappingURL=batch.d.ts.map