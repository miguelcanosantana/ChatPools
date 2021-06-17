import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Report } from '../model/report';


@Injectable({
  providedIn: 'root'
})


export class ReportsService {


  constructor(private fireStore: AngularFirestore) {}


  //Get all reports from an User
  public getReports(uid: string): Observable<Report[]> {

    return this.fireStore.collection<Report>('reports/' + uid + '/user-reports').snapshotChanges().pipe(
      map(
        snaps => snaps.map(
          snap => <Report>{
            ...snap.payload.doc.data()
          }
        )
      )
    );
  }


  //Delete a report from the user folder inside reports
  public deleteReport(report: Report): Promise<void> {
    return this.fireStore.collection('reports/' + report.reportedUserId + '/user-reports').doc(report.reportId).delete();
  }

}
