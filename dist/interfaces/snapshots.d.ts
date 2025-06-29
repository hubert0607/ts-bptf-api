export interface Attribute {
    defindex: number;
    value?: string | number | null;
    float_value?: number | null;
}
export interface Item {
    id?: number;
    original_id?: number;
    defindex: number;
    quality: number;
    quantity?: number | string;
    attributes?: Attribute[];
    marketplace_price?: number;
    marketplace_sku?: string;
}
export interface SnapshotCurrencies {
    usd?: number;
    keys?: number;
    metal?: number;
}
export interface SnapshotListing {
    steamid: string;
    offers: number;
    buyout: number;
    details: string;
    intent: string;
    timestamp: number;
    price: number;
    item: Item;
    currencies: SnapshotCurrencies;
    bump: number;
}
export interface SnapshotResponse {
    listings: SnapshotListing[];
    appid?: number;
    sku?: string;
    created_at?: number;
}
//# sourceMappingURL=snapshots.d.ts.map