import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pool } from '../model/pool';
import { map } from 'rxjs/operators';
import { User } from '../model/user';
import { Groupmessage } from '../model/groupmessage';


@Injectable({
  providedIn: 'root'
})


export class FirestoreService {


  constructor(private fireStore: AngularFirestore) {}


  // Get FireStore User by it's id
  getUserByUid(uid: string): Observable<User> {
    return this.fireStore.collection('users').doc<User>(uid).valueChanges();
  }


  // Get a Pool by it's name
  getPoolByName(name: string): Observable<Pool> {
    return this.fireStore.collection('pools').doc<Pool>(name).valueChanges();
  }


  // Get all Pools from FireStore
  public getPools(): Observable<Pool[]> {

    return this.fireStore.collection<Pool>('pools').snapshotChanges().pipe(
      map(
        snaps => snaps.map(
          snap => <Pool>{
            ...snap.payload.doc.data()
          }
        )
      )
    );
  }


  // Add a message to the pool
  // addMessage(poolName: string, message: Groupmessage) {

  //   this.fireStore.collection('pools/' + poolName + '/messages').doc(message.id).set(message).then(() => {

  //     console.log("Message successfully written");
  
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }


    // Add a message to the pool
    public addMessage(poolName: string, message: Groupmessage): Promise<void> {
      return this.fireStore.collection('pools/' + poolName + '/messages').doc(message.id).set(message);
    }


  // Get all messages from a Pool
  public getMessages(poolName: string): Observable<Groupmessage[]> {

    return this.fireStore.collection<Groupmessage>('pools/' + poolName + '/messages').snapshotChanges().pipe(
      map(
        snaps => snaps.map(
          snap => <Groupmessage>{
            ...snap.payload.doc.data()
          }
        )
      )
    );
  }

  


}
