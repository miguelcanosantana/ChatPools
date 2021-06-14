import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

import * as Moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(
    private fireStorage: AngularFireStorage
  ) {}


  //Upload image to storage and get it's url back
  uploadImage(isAvatar: boolean, imageBase: string, uid: string): AngularFireUploadTask {

    //Time
    let utcTime = Moment.utc().valueOf();

    let path: AngularFireStorageReference;

    //Choose path depending on image type
    if (isAvatar) path = this.fireStorage.ref("avatars/" + uid + "/" + utcTime);
    else path = this.fireStorage.ref("chats/" + uid + "/" + utcTime);

    return path.putString(imageBase, "base64");
  }

}


