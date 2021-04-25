import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class CheckuserService {

  constructor() { }


  // Get local User's uid
  async getUid() {
    const ret = await Storage.get({ key: 'uid' });
    const user = JSON.parse(ret.value);
  }


  // Set local User's uid
  async setUid(userId: string) {
    await Storage.set({
      key: 'uid',
      value: userId
    });
  }


  // Remove local User's uid
  async removeUid() {
    await Storage.remove({ key: 'uid' });
  }
}
