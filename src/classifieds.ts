import axios from 'axios';
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

  constructor() {
    this.token = process.env.BP_TOKEN!;
    this.startAutoSend();
  }

  private startAutoSend() {
    this.timer = setInterval(async () => {
      if (this.listings.length > 0) {
        await this.sendBatch();
      }
    }, 5*60*1000); // 5 minut
  }

  public addListing(listing: BatchListing): void {
    this.listings.push(listing);
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