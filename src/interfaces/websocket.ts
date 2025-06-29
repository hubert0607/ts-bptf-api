export interface EventMessage {
  id: string;
  event: string;
  payload: Payload;
}

export interface Payload {
  id: string;
  steamid: string;
  appid: number;
  currencies: {
    metal?: number;
    keys?: number;
  };
  value: {
    raw: number;
    short: string;
    long: string;
  };
  details?: string;
  listedAt: number;
  bumpedAt: number;
  intent: string;
  count: number;
  status: string;
  source: string;
  tradeOffersPreferred?: boolean;
  buyoutOnly?: boolean;
  item: Item;
  user: User;
}

export interface Item {
  appid: number;
  baseName: string;
  defindex: number;
  id: string;
  imageUrl: string;
  marketName: string;
  name: string;
  origin: Origin | null;
  originalId: string;
  quality: Quality;
  summary: string;
  price: ItemPrice | ItemPrice[];
  class?: string[];
  slot?: string;
  tradable: boolean;
  craftable: boolean;
  level?: number;
  customDesc?: string;
  tag?: string | null;

  spells?: Spell[];
  elevatedQuality?: Quality;
  texture?: Texture;
  wearTier?: WearTier;
  killEaters?: KillEaterScore[];
  particle?: Particle;
  sheen?: Sheen;
  killstreaker?: Killstreaker;
  paint?: Paint;
  festivized?: boolean;
  australium?: boolean;
  strangeParts?: StrangePart[];
  recipe?: Recipe;
  priceindex?: string;
}

export interface Origin {
  id: number;
  name: string;
}

export interface Quality {
  id: number;
  name: string;
  color: string;
}

export interface Spell {
  id: string;
  spellId: string;
  name: string;
  type: string;
  defindex?: number;
  color?: string;
}

export interface Texture {
  id: number;
  itemDefindex: number;
  rarity: {
    id: number;
    name: string;
    color: string;
  };
  name: string;
}

export interface WearTier {
  id: number;
  name: string;
  short: string;
}

export interface KillEaterScore {
  score: number;
  killEater: {
    name: string;
  };
}

export interface Particle {
  id: number;
  name: string;
  shortName: string;
  imageUrl: string;
  type: string;
}

export interface Sheen {
  id: number;
  name: string;
}

export interface Killstreaker {
  id: number;
  name: string;
}

export interface Paint {
  id: number;
  name: string;
  color: string;
}

export interface StrangePart {
  score: number;
  killEater: {
    id: number;
    name: string;
    item: Item;
  };
}

export interface Recipe {
  estimatedCraftingCost: any[];
  inputItems: any[];
  outputItem: any | null;
  targetItem: TargetItem;
}

export interface TargetItem {
  itemName: string;
  imageUrl: string;
  _source: {
    _id: string;
    name: string;
    defindex: number;
    item_class: string;
    item_type_name: string;
    item_name: string;
    proper_name: boolean;
    item_slot: string;
    item_quality: number;
    image_inventory: string;
    min_ilevel: number;
    max_ilevel: number;
    image_url: string;
    image_url_large: string;
    craft_class: string;
    craft_material_type: string;
    capabilities: Record<string, boolean>;
    styles: { name: string }[];
    used_by_classes: string[];
    first_sale_date: number;
    release_date: number;
    appid: number;
    _keywords: string[];
  };
}

export interface ItemPriceEntry {
  raw: number;
  short: string;
  long: string;
  usd?: number;
  value?: number;
  currency?: string;
  valueHigh?: number;
  updatedAt?: number;
  difference?: number;
}

export interface ItemPrice {
  steam?: ItemPriceEntry;
  suggested?: ItemPriceEntry;
  community?: ItemPriceEntry;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  avatarFull: string;
  premium: boolean;
  online: boolean;
  banned: boolean;
  customNameStyle: string;
  acceptedSuggestions: number;
  class: string;
  style: string;
  role: string | null;
  tradeOfferUrl: string;
  isMarketplaceSeller: boolean;
  flagImpersonated: string | null;
  bans: any[];
}
