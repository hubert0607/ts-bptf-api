// Update interfaces
export interface ListingCurrencies {
  metal?: number;
  keys?: number;
}
  
export interface listingPatchRequest {
  currencies: ListingCurrencies;
  details?: string;
  quantity?: number;
}
