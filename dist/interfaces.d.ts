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
export interface UpdateCurrencies {
    metal?: number;
    keys?: number;
}
export interface UpdateListingV2 {
    currencies: UpdateCurrencies;
    details?: string;
    quantity?: number;
}
export interface BatchCurrencies {
    metal: number;
    keys: number;
}
export interface BatchItem {
    quality: string;
    item_name: string;
    craftable?: number;
    priceindex?: number;
    elevated_quality?: string;
    particle_name?: string;
}
export interface BatchListing {
    intent: 0 | 1;
    details?: string;
    currencies: BatchCurrencies;
    item: BatchItem;
    offers?: number;
    buyout?: number;
    promoted?: number;
}
//# sourceMappingURL=interfaces.d.ts.map