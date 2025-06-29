export interface EntityV2 {
    id: number;
    name?: string;
    color?: string;
}
export interface ItemV2 {
    baseName: string;
    quantity?: number;
    quality?: EntityV2;
    paint?: EntityV2;
    particle?: EntityV2;
    elevatedQuality?: EntityV2;
    tradable: boolean;
    craftable: boolean;
    killstreakTier?: number;
    sheen?: EntityV2;
    killstreaker?: EntityV2;
    recipe?: recipe;
    festivized?: boolean;
    australium?: boolean;
    spells?: Spell[];
}
export interface recipe {
    targetItem: targetItem;
}
export interface targetItem {
    itemName: string;
}
export interface Spell {
    id?: string;
    spellId: string;
    name?: string;
    type: string;
}
export interface ListingCurrencies {
    metal?: number;
    keys?: number;
}
export interface ListingResolvable {
    id?: number;
    item?: ItemV2;
    offers: number;
    buyout: number;
    details?: string;
    currencies: ListingCurrencies;
}
//# sourceMappingURL=batch.d.ts.map