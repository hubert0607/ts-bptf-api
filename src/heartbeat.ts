import axios from 'axios';

interface HeartbeatApiResponse {
  status: string;
}

export class Heartbeat {
  private token: string;

  constructor() {
    this.token = process.env.BP_TOKEN || '';
    if (!this.token) {
      throw new Error('BP_TOKEN environment variable is required');
    }
  }

  async getStatus(): Promise<string> {
    const url = 'https://backpack.tf/api/agent/status';
    const params = new URLSearchParams({
      token: this.token
    });

    const response = await axios.post<HeartbeatApiResponse>(url, params);
    return response.data.status;
  }

  async registerOrRefresh(userAgentName: string): Promise<string> {
    const url = 'https://backpack.tf/api/agent/pulse';
    const params = new URLSearchParams({
      token: this.token
    });

    const headers = {
      'User-Agent': userAgentName
    };

    const response = await axios.post<HeartbeatApiResponse>(url, params, { headers });
    return response.data.status;
  }

  async stop(): Promise<string> {
    const url = 'https://backpack.tf/api/agent/stop';
    const params = new URLSearchParams({
      token: this.token
    });

    const response = await axios.post<HeartbeatApiResponse>(url, params);
    return response.data.status;
  }
}

let test = new Heartbeat()

test.getStatus()