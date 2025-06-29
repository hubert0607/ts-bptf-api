import axios from "axios";
import Bottleneck from 'bottleneck';
import {
  ListingResolvable,
  ItemV2,
  ListingCurrencies
} from './interfaces/batch';

const BATCH_LIMITER = new Bottleneck({
  maxConcurrent: 1,
  minTime: 6000 // 10 requests/minute
});

export class BatchClientV2 {
  private readonly token: string;
  private listings: ListingResolvable[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(autoSendTimeInterval: number = 5*60*1000) {
    this.token = process.env.BP_TOKEN!;
    this.startAutoSend(autoSendTimeInterval);
  }

  private startAutoSend(autoSendTimeInterval: number) {
    this.timer = setInterval(async () => {
      if (this.listings.length > 0) {
        await this.sendBatch();
      }
    }, autoSendTimeInterval);
  }

  private addListing(listing: ListingResolvable): void {
    this.listings.push(listing);
    this.checkBatchSize();
  }

  public addBuyListing(
    item: ItemV2, 
    currencies: ListingCurrencies, 
    details?: string
  ): void {
    const listing: ListingResolvable = {
      item: item,
      currencies: currencies,
      offers: 1,
      buyout: 1,
      details: details
    };
    this.addListing(listing);
  }

  public addSellListing(
    itemId: number, 
    currencies: ListingCurrencies, 
    details?: string
  ): void {
    const listing: ListingResolvable = {
      id: itemId,
      offers: 1,
      buyout: 1,
      currencies: currencies,
      details: details
    };
    this.addListing(listing);
  }

  private checkBatchSize(): void {
    if (this.listings.length >= 100) {
      this.sendBatch();
    }
  }

  public async flush(): Promise<any> {
    if (this.listings.length === 0) return [];
    const result = await this.sendBatch();
    return result;
  }

  private async sendBatch(): Promise<any> {
    const batchToSend = [...this.listings];
    this.listings = [];

    try {
      const result = await BATCH_LIMITER.schedule(async () => {
        const response = await axios.post(
          'https://backpack.tf/api/v2/classifieds/listings/batch',
          batchToSend,
          { params: { token: this.token } }
        );
        return response.data;
      });
      return result;
    } catch (error) {
      this.listings.unshift(...batchToSend);
      console.error('Batch send failed:', error);
      throw error;
    }
  }

  public destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

// Example usage
if (require.main === module) {
  const batchClient = new BatchClientV2();

  let itemNew: ItemV2 = {
    baseName: 'Rocket Launcher',
    quality: { id: 11 },
    killstreakTier: 3,
    tradable: true,
    craftable: true,
    australium: true,
    festivized: true,
    sheen: { id: 1, name: 'Team Shine' },
    spells: [
        {
          spellId: 'SPELL: Halloween death ghosts',
          type: 'weapon'
        },
        {
          spellId: 'SPELL: Halloween pumpkin explosions',
          type: 'weapon'
        }
      ],
  }

  batchClient.addBuyListing(itemNew, {metal:0.11, keys:1}, 'hello world')
  batchClient.flush()
}
