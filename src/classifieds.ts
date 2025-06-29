import axios from "axios";
import Bottleneck from 'bottleneck';
import { listingPatchRequest } from './interfaces/classifieds';

const UPDATE_LIMITER = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000 // 60 requests/minute
});

export class ClassifiedsClient {
  private readonly token: string;

  constructor() {
    this.token = process.env.BP_TOKEN!;
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

  async publishAll(): Promise<any> {
    const response = await axios.post(
        `https://backpack.tf/api/v2/classifieds/listings/publishAll`,
        null,
        { params: { token: this.token } }
      );
      return response.data;
  }

  async archiveAll(): Promise<any> {
    const response = await axios.post(
        `https://backpack.tf/api/v2/classifieds/listings/archiveAll`,
        null,
        { params: { token: this.token } }
      );
      return response.data;
  }
}

// Example usage
if (require.main === module) {
  const classifiedsClient = new ClassifiedsClient()
  classifiedsClient.publishAll()
}