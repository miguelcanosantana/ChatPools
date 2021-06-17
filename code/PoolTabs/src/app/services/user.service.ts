import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { map } from 'rxjs/operators';
import { Pool } from '../model/pool';
import { UserPool } from '../model/user-pool';


@Injectable({
  providedIn: 'root'
})


export class UserService {


  constructor(private fireStore: AngularFirestore) {}


  //Create FireStore User
  createFireStoreUser(user: User): Promise<void> {
    return this.fireStore.collection('users/').doc(user.uid).set(user);
  }


  //Get users with matching nick
  getUsersWithNick(nickName: string): Observable<User[]> {

    return this.fireStore.collection<User>('users/', ref => ref.where('nick', '==', nickName)).snapshotChanges().pipe(
      map(
        snaps => snaps.map(
          snap => <User>{
            ...snap.payload.doc.data()
          }
        )
      )
    );
  }


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


  //Ban user
  public banUser(uid: string): Promise<void> {
    return this.fireStore.collection('users/').doc(uid).update({isBanned: true});
  }


}