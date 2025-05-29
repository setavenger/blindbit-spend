import { HeightResponse, UtxosResponse } from "./models";

let Buffer = require('buffer/').Buffer;


export class BlindBitAPIService {
  baseURL: string;
  username: string; // if changed also change header
  password: string; // if changed also change header
  authHeader: string;

  constructor(baseURL: string, username: string, password: string) {
    this.baseURL = baseURL.replace(/\/$/, ""); // todo might want to use slice instead
    this.username = username;
    this.password = password;
    this.authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  }

  public async fetchUtxos(): Promise<UtxosResponse> {
    try {
        const response = await fetch(`${this.baseURL}/utxos`, {
            method: 'GET',
            headers: {
              Authorization: this.authHeader,
              'Content-Type': 'application/json',
            },
          });
          if (response.status < 200 || response.status > 299) {
            console.log("status code:", response.status);
          }
          if (response.status === 401) {
            throw new Error("unathorized");
          }
          if (!response.ok) {
            throw new Error('utxo call not okay: ' + await response.text());
          }
          return await response.json();
    } catch (error) {
      // logs before the inner error is thrown?!?
      // console.error('utxo API call failed:', error);
      throw error
    }
  }

  public async fetchHeight(): Promise<number> {
    try {
      const response = await fetch(`${this.baseURL}/height`, {
        method: 'GET',
        headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
        },
      });
        if (response.status < 200 || response.status > 299) {
        	console.log("status code:", response.status);
        }
        if (response.status === 401) {
        	throw new Error("unathorized");
        }
        if (!response.ok) {
        	throw new Error('height call not okay: ' + await response.text());
        }
        const data: HeightResponse = await response.json()
        return data.height;
    } catch (error) {
      console.error('height API call failed:', error);
      throw error
    }
  }
}
