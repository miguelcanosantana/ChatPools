import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pool } from '../model/pool';
import { User } from '../model/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {


  constructor(private fireStore: AngularFirestore) {}


  // Get FireStore User by it's id
  getUserByUid(uid: string): Observable<User> {
    return this.fireStore.collection('users').doc<User>(uid).valueChanges();
  }


  // Add pool to the db
  addPool(pool: Pool) {

    this.fireStore.collection('pools/').doc(pool.name).set(pool).then(() => {

      console.log("Pool successfully written");
  
    }).catch((error) => {
      console.log(error);
    });
  }


  // Remove pool from the db
  removePool(poolName: string) {

    this.fireStore.collection('pools/').doc(poolName).delete().then(() => {

      console.log("Pool successfully deleted");
  
    }).catch((error) => {
      console.log(error);
    });
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
  


}
