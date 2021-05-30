import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FauthService {

  constructor(private fireAuth: AngularFireAuth) {}


  //Create User with email
  createUser(email: string, password: string):Promise<firebase.default.auth.UserCredential> {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }


  //Login with email
  login(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }


  //Logout
  logout(): Promise<void> {
    return this.fireAuth.signOut();
  }


  //Reset User password if email
  resetPassword(email: string): Promise<void> {
    return this.fireAuth.sendPasswordResetEmail(email);
  }


  //Get current User logged in
  getCurrentUser(): Observable<firebase.default.User> {
    return this.fireAuth.authState;
  }

}
