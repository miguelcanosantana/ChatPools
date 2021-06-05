import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../model/user';


@Injectable({
  providedIn: 'root'
})


export class UserService {


  constructor(private fireStore: AngularFirestore) {}


  //Get FireStore User by it's id
  getUserByUid(uid: string): Observable<User> {
    return this.fireStore.collection('users').doc<User>(uid).valueChanges();
  }


  //Save User nick
  public saveUserNick(uid: string, username: string): Promise<void> {
    return this.fireStore.collection('users/').doc(uid).update({nick: username});
  }
  

  //Save User description
  public saveUserDescription(uid: string, text: string): Promise<void> {
    return this.fireStore.collection('users/').doc(uid).update({description: text});
  }
  
}
