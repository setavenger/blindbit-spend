import { BlindBitAPIService } from './api-service';
import { BlindBitNwcService } from './nwc';
import { Utxo } from './models';

export type BlindBitServiceType = 'rest-api' | 'nwc';

export class BlindBitService {
  private apiService?: BlindBitAPIService;
  private nwcService?: BlindBitNwcService;
  private serviceType: BlindBitServiceType;

  constructor(type: BlindBitServiceType, config: {
    baseURL?: string;
    username?: string;
    password?: string;
    nwcUri?: string;
  }) {
    this.serviceType = type;

    if (type === 'rest-api') {
      if (!config.baseURL || !config.username || !config.password) {
        throw new Error('REST API configuration requires baseURL, username, and password');
      }
      this.apiService = new BlindBitAPIService(config.baseURL, config.username, config.password);
    } else if (type === 'nwc') {
      if (!config.nwcUri) {
        throw new Error('NWC configuration requires nwcUri');
      }
      this.nwcService = new BlindBitNwcService(config.nwcUri);
    }
  }

  async fetchHeight(): Promise<number> {
    if (this.serviceType === 'rest-api' && this.apiService) {
      return this.apiService.fetchHeight();
    } else if (this.serviceType === 'nwc' && this.nwcService) {
      const info = await this.nwcService.getInfo();
      return info.block_height;
    }
    throw new Error('Service not properly initialized');
  }

  async fetchUtxos(): Promise<Utxo[]> {
    if (this.serviceType === 'rest-api' && this.apiService) {
      const response = await this.apiService.fetchUtxos();
      return response;
    } else if (this.serviceType === 'nwc' && this.nwcService) {
      return this.nwcService.getUtxos();
    }
    throw new Error('Service not properly initialized');
  }
} 