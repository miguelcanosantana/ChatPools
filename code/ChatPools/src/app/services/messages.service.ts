import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../model/message';


@Injectable({
  providedIn: 'root'
})


export class MessagesService {


  constructor(private fireStore: AngularFirestore) {}


  //Add a message to the pool
  public addMessage(poolName: string, message: Message): Promise<void> {
    return this.fireStore.collection('pools/' + poolName + '/messages').doc(message.id).set(message);
  }


  //Get all messages from a Pool
  public getMessages(poolName: string): Observable<Message[]> {

    return this.fireStore.collection<Message>('pools/' + poolName + '/messages').snapshotChanges().pipe(
      map(
        snaps => snaps.map(
          snap => <Message>{
            ...snap.payload.doc.data()
          }
        )
      )
    );
  }
}
