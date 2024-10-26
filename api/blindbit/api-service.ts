import { HeightResponse, UtxosResponse } from "./models";
import Tor from "react-native-tor";

let Buffer = require('buffer/').Buffer;

const tor = Tor()

export class BlindBitAPIService {
  baseURL: string;
  username: string; // if changed also change header
  password: string; // if changed also change header
  authHeader: string;
  useTor: boolean;

  constructor(baseURL: string, username: string, password: string, useTor: boolean = false) {
    this.baseURL = baseURL.replace(/\/$/,""); // todo might want to use slice instead
    this.username = username;
    this.password = password;
    this.authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    this.useTor = useTor;

    // Initialize Tor connectivity if required
    if (this.useTor) {
      // this.setupTorConnection();
    }
  }

  private async setupTorConnection() {
    console.log('Setting up tor connection');
    await tor.startIfNotStarted();

    // Setup Tor connection logic here
    console.log('Tor connection has been initialized');
  }

  public async fetchUtxos(): Promise<UtxosResponse> {
    try {
      if (!this.useTor) {
        const response = await fetch(`${this.baseURL}/utxos`, {
          method: 'GET',
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('API call failed: ' + response.statusText);
        }
        return await response.json();
      } else {
        await tor.startIfNotStarted();
        const resp = await tor.get(`${this.baseURL}/utxos`, {
          'Authorization': this.authHeader, 
          'Content-Type': 'application/json'
        })
        return resp.json
      }
    } catch (error) {console
      console.error('API call failed:', error);
      throw error
    }
  }

  public async fetchHeight(): Promise<HeightResponse> {
    try {
      if (!this.useTor) {
        const response = await fetch(`${this.baseURL}/height`, {
          method: 'GET',
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('API call failed: ' + response.statusText);
        }
        return await response.json();
      } else {
        await tor.startIfNotStarted();
        const resp = await tor.get(`${this.baseURL}/height`, {
          'Authorization': this.authHeader, 
          'Content-Type': 'application/json'
        })
        return resp.json
      }
    } catch (error) {
      console.error('API call failed:', error);
      throw error
    }
  }
}

