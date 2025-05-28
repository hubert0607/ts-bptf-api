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





  
export interface ListingCurrencies {
  metal?: number;
  keys?: number;
}
  
export interface listingPatchRequest {
  currencies: ListingCurrencies;
  details?: string;
  quantity?: number;
}



export interface EntityV2 {
  id: number;
  name?: string;
  color?: string;
}

export interface ItemV2 {
  baseName: string;
  quantity?: number;
  quality?: EntityV2;
  rarity?: EntityV2;
  paint?: EntityV2;
  particle?: EntityV2;
  elevatedQuality?: EntityV2;
  
  tradable: boolean
  craftable: boolean
  
  killstreakTier?: number
  sheen?: EntityV2
  killstreaker?: EntityV2
  
  festivized?: boolean
  australium?: boolean

  spells?: Spell[]
}

export interface Spell {
  id?: string
  spellId: string
  name?: string
  type: string
}


export interface ListingResolvable {
  id?: number; // For sell listings (item ID from inventory)
  item?: ItemV2; // For buy listings
  offers: number,
  buyout: number,
  details?: string;
  currencies: ListingCurrencies;
}

// export interface ListingBatchCreateResult {
//   result?: any; // This would be the actual listing object
//   error?: any; // This would be the error object
// }