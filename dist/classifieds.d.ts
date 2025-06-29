import { listingPatchRequest } from './interfaces/classifieds';
export declare class ClassifiedsClient {
    private readonly token;
    constructor();
    updateListing(listingId: string, update: listingPatchRequest): Promise<any>;
    deleteListing(listingId: string): Promise<any>;
    publishAll(): Promise<any>;
    archiveAll(): Promise<any>;
}
//# sourceMappingURL=classifieds.d.ts.map