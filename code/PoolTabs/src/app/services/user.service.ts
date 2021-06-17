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


  //Get all Users from FireStore
  public getUsers(): Observable<User[]> {

    return this.fireStore.collection<User>('users').snapshotChanges().pipe(
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


  //Save User avatar
  public saveUserAvatar(uid: string, imagePath: string): Promise<void> {
    console.log(imagePath);
    return this.fireStore.collection('users/').doc(uid).update({image: imagePath});
  }


  //Save User description
  public saveUserDescription(uid: string, text: string): Promise<void> {
    return this.fireStore.collection('users/').doc(uid).update({description: text});
  }


  //Ban User
  public banUser(uid: string): Promise<void> {
    return this.fireStore.collection('users/').doc(uid).update({isBanned: true});
  }


  //UnBan User
  public unBanUser(uid: string): Promise<void> {
    return this.fireStore.collection('users/').doc(uid).update({isBanned: false});
  }


  //Promote User to Moderator or Admin
  public promoteUser(uid: string, promotionType: string): Promise<void> {

    if (promotionType == "toAdmin") return this.fireStore.collection('users/').doc(uid).update({isAdmin: true});
    if (promotionType == "toModerator") return this.fireStore.collection('users/').doc(uid).update({isModerator: true});
  }


  //Demote User from Moderator or Admin
  public demoteUser(uid: string, demotionType: string): Promise<void> {

    if (demotionType == "fromAdmin") return this.fireStore.collection('users/').doc(uid).update({isAdmin: false});
    if (demotionType == "fromModerator") return this.fireStore.collection('users/').doc(uid).update({isModerator: false});
  }

}
