import axios from 'axios';
import Bottleneck from 'bottleneck';
import {
  SnapshotResponse,
  UpdateListingV2,
  BatchListing
} from './interfaces';

const BATCH_LIMITER = new Bottleneck({
  maxConcurrent: 1,
  minTime: 6000 // 10 requests/minute
});

const STANDARD_LIMITER = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000 // 60 requests/minute
});

export default class ClassifiedsClient {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
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

  async createBatchListings(listings: BatchListing[]): Promise<any> {
    return BATCH_LIMITER.schedule(async () => {
      const response = await axios.post(
        'https://backpack.tf/api/classifieds/list/v1',
        {
          token: this.token,
          listings
        }
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



async function test() {
    const client = new ClassifiedsClient(process.env.BP_TOKEN!);
    
    // // Get snapshot
    // const snapshot = await client.getSnapshot('Burning Flames Team Captain');
    // console.log(snapshot)

    // const newListing: BatchListing = {
    //     intent: 1,
    //     currencies: { metal: 2, keys: 2 },
    //     item: {
    //       quality: "Strange",
    //       item_name: "Professional Killstreak Minigun",
    //     }
    //   };
      
    //   const batchResult = await client.createBatchListings([newListing]);
}    
