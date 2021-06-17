import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class FireAuthService {


  constructor(private fireAuth: AngularFireAuth) {}


  //Login with email
  login(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }


  //Logout
  logout(): Promise<void> {
    return this.fireAuth.signOut();
  }


  //Get current User logged in
  getCurrentUser(): Observable<firebase.default.User> {
    return this.fireAuth.authState;
  }

}
