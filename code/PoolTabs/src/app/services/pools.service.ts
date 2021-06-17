import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pool } from '../model/pool';


@Injectable({
  providedIn: 'root'
})


export class PoolsService {


  constructor(private fireStore: AngularFirestore) {}


  //Get a Pool by it's name
  getPoolByName(name: string): Observable<Pool> {
    return this.fireStore.collection('pools').doc<Pool>(name).valueChanges();
  }


  //Get all Pools from FireStore
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


  //Update the description of Pool
  public updatePoolName(poolName: string, newDescription: string): Promise<void> {
    return this.fireStore.collection('pools/').doc(poolName).update({description: newDescription});
  }


  //Delete a Pool
  public deletePool(name: string): Promise<void> {
    return this.fireStore.collection('pools/').doc(name).delete();
  }

}
