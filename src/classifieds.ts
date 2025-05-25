import axios from "axios";
import Bottleneck from 'bottleneck';
import {
  SnapshotResponse,
  UpdateListingV2,
  BatchListing
} from './interfaces';

const STANDARD_LIMITER = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000 // 60 requests/minute
});

const BATCH_LIMITER = new Bottleneck({
  maxConcurrent: 1,
  minTime: 6000 // 10 requests/minute
});

export class ClassifiedsClient {
  private readonly token: string;

  constructor() {
    this.token = process.env.BP_TOKEN!;
  }

  async getSnapshot(sku: string): Promise<SnapshotResponse> {
    return STANDARD_LIMITER.schedule(async () => {
      const response = await axios.get('https://backpack.tf/api/classifieds/listings/snapshot', {
        params: {
          token: this.token,
          appid: 440,
          sku
        }
      });
      return response.data;
    });
  }

  async updateListing(listingId: string, update: UpdateListingV2): Promise<any> {
    return STANDARD_LIMITER.schedule(async () => {
      const response = await axios.patch(
        `https://backpack.tf/api/v2/classifieds/listings/${listingId}`,
        update,
        { params: { token: this.token } }
      );
      return response.data;
    });
  }

  async deleteListing(listingId: string): Promise<any> {
    return STANDARD_LIMITER.schedule(async () => {
      const response = await axios.delete(
        `https://backpack.tf/api/v2/classifieds/listings/${listingId}`,
        { params: { token: this.token } }
      );
      return response.data;
    });
  }
}



export class BatchClient {
  private readonly token: string;
  private listings: BatchListing[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(autoSendTimeInterval: number = 5*60*1000) {
    this.token = process.env.BP_TOKEN!;
    this.startAutoSend(autoSendTimeInterval);
  }

  private processItem(item: BatchListing['item']): BatchListing['item'] {
    const processed = { ...item };
    let itemName = item.item_name;

    // Remove quality from item name
    if (typeof item.quality === 'string') {
      itemName = itemName.replace(item.quality + ' ', '');
    }

    // Handle elevated quality
    if (item.elevated_quality) {
      itemName = itemName.replace(item.elevated_quality + ' ', '');
      processed.quality = `${item.elevated_quality} ${item.quality}`;
    }

    // Handle particle effects
    if (item.particle_name) {
      itemName = itemName.replace(item.particle_name + ' ', '');
    }

    // Validate particle effects
    if (item.priceindex && item.priceindex !== 0 && !item.particle_name) {
      throw new Error('You forgot to set up particle_name');
    }
    if ((!item.priceindex || item.priceindex === 0) && item.particle_name) {
      throw new Error('You forgot to set up priceindex (id of particle name)');
    }

    // Handle non-craftable items
    if (item.craftable === 0) {
      itemName = itemName.replace('Non-Craftable ', '');
    }

    processed.item_name = itemName;
    
    // Remove processing fields from output
    delete processed.elevated_quality;
    delete processed.particle_name;

    return processed;
  }

  private startAutoSend(autoSendTimeInterval: number) {
    this.timer = setInterval(async () => {
      if (this.listings.length > 0) {
        await this.sendBatch();
      }
    }, autoSendTimeInterval); // 5 minut
  }

  public addListing(listing: BatchListing): void {
    const processedListing = {
      ...listing,
      item: this.processItem(listing.item)
    };
    this.listings.push(processedListing);
    this.checkBatchSize();
  }

  private checkBatchSize(): void {
    if (this.listings.length >= 100) {
      this.sendBatch();
    }
  }

  public async flush(): Promise<void> {
    if (this.listings.length === 0) return;
    await this.sendBatch();
  }

  private async sendBatch(): Promise<void> {
    const batchToSend = [...this.listings];
    this.listings = [];

    try {
      await BATCH_LIMITER.schedule(async () => {
        await axios.post(
          'https://backpack.tf/api/classifieds/list/v1',
          {
            token: this.token,
            listings: batchToSend
          }
        );
      });
    } catch (error) {
      this.listings.unshift(...batchToSend);
      console.error('Batch send failed:', error);
      throw error;
    }
  }
}