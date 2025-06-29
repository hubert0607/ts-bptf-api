import axios from "axios";
import Bottleneck from 'bottleneck';
import { SnapshotResponse } from './interfaces/snapshots';

const STANDARD_LIMITER = new Bottleneck({
  maxConcurrent: 1,
  minTime: 10000 // 6 requests/minute
});

export class SnapshotsClient {
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
}
