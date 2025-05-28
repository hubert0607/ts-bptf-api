import axios from "axios";
import Bottleneck from 'bottleneck';
import {
  SnapshotResponse,
  listingPatchRequest,
  ListingResolvable,
  ItemV2,
  ListingCurrencies
} from './interfaces';

const STANDARD_LIMITER = new Bottleneck({
  maxConcurrent: 1,
  minTime: 10000 // 10 requests/minute
});

const UPDATE_LIMITER = new Bottleneck({
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

  async updateListing(listingId: string, update: listingPatchRequest): Promise<any> {
    return UPDATE_LIMITER.schedule(async () => {
      const response = await axios.patch(
        `https://backpack.tf/api/v2/classifieds/listings/${listingId}`,
        update,
        { params: { token: this.token } }
      );
      return response.data;
    });
  }

  async deleteListing(listingId: string): Promise<any> {
    return UPDATE_LIMITER.schedule(async () => {
      const response = await axios.delete(
        `https://backpack.tf/api/v2/classifieds/listings/${listingId}`,
        { params: { token: this.token } }
      );
      return response.data;
    });
  }

  
  async publishAll() {
    const response = await axios.post(
        `https://backpack.tf/api/v2/classifieds/listings/publishAll`,
        null,
        { params: { token: this.token } }
      );
      return response.data;
  }

  async archiveAll() {
    const response = await axios.post(
        `https://backpack.tf/api/v2/classifieds/listings/archiveAll`,
        null,
        { params: { token: this.token } }
      );
      return response.data;
  }
}



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
}

// if (require.main === module) {
//   const batchClient = new BatchClientV2();

//   let itemNew: ItemV2 = {
//     baseName: 'Rocket Launcher',
//     quality: { id: 11 },
//     killstreakTier: 3,
//     tradable: true,
//     craftable: true,
//     australium: true,
//     festivized: true,
//     sheen: { id: 1, name: 'Team Shine' },
//     spells: [
//         {
//           // id: 'weapon-SPELL: Halloween death ghosts',
//           spellId: 'SPELL: Halloween death ghosts',
//           // name: 'Exorcism',
//           type: 'weapon'
//         },
//         {
//         //   id: 'weapon-SPELL: Halloween pumpkin explosions',
//           spellId: 'SPELL: Halloween pumpkin explosions',
//         //   name: 'Pumpkin Bombs',
//           type: 'weapon'
//         }
//       ],
//   }

//   batchClient.addBuyListing(itemNew, {metal:0.11, keys:1}, 'hello world')
//   batchClient.flush()
//   // console.log('done')
// }