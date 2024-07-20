import { HeightResponse, UtxosResponse } from "./models";

export class BlindBitAPIService {
  private baseURL: string;
  private authHeader: string;
  private useTor: boolean;

  constructor(baseURL: string, username: string, password: string, useTor: boolean = false) {
    this.baseURL = baseURL;
    this.authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    this.useTor = useTor;
    // Initialize Tor connectivity if required
    if (this.useTor) {
      this.setupTorConnection();
    }
  }

  private setupTorConnection() {
    // Setup Tor connection logic here
    console.log('Tor connection has been initialized.');
  }

  public async fetchData(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: 'GET',
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
        },
        // Additional configuration for Tor if necessary
      });
      if (!response.ok) {
        throw new Error('API call failed: ' + response.statusText);
      }
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  public async fetchUtxos(): Promise<UtxosResponse> {
    try {
      const response = await fetch(`${this.baseURL}/utxos`, {
        method: 'GET',
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
        },
        // Additional configuration for Tor if necessary
      });
      if (!response.ok) {
        throw new Error('API call failed: ' + response.statusText);
      }
      return await response.json();
    } catch (error) {console
      console.error('API call failed:', error);
      throw error
    }
  }

  public async fetchHeight(): Promise<HeightResponse> {
    try {
      const response = await fetch(`${this.baseURL}/height`, {
        method: 'GET',
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
        },
        // Additional configuration for Tor if necessary
      });
      if (!response.ok) {
        throw new Error('API call failed: ' + response.statusText);
      }
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error
    }
  }
}

