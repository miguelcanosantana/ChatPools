import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Pool } from '../model/pool';
import { FirestoreService } from '../services/firestore.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  // Variables
  hasAdmin: boolean = false;

  email: string;
  password: string;

  name: string; 
  description: string;
  image: string;

  allPools: Pool[] = [];


  constructor(
    public auth: AuthService,
    private fireStore: FirestoreService,
  ) {

    // Get all pools and subscribe
    this.fireStore.getPools().subscribe(
      data => this.allPools = data
    );

  }
  

  // Try to login with user
  async login() {

    await this.auth.login(this.email, this.password);

    // Check if user is admin
    await this.getAdmin();
  }


  // Close session
  async closeSession() {
    this.auth.logout();
  }


  // Get if user is admin
  async getAdmin() {

    // Get current FireAuth user
    await this.auth.getCurrentUser().subscribe(

      data => {

        // Get the equivalent User on FireStore
        this.fireStore.getUserByUid(data.uid).subscribe(

          user => {

            // If user is admin set admin to true
            if (user.isAdmin) {

              console.log("User has admin");
              this.hasAdmin = true;

            } else {

              console.log("User isn't admin");
              this.hasAdmin = false;
            }
          }
        )
      }
    );
  }


  // Create a pool for the main app
  async createPool() {

    // Check if user is admin and add a new pool inside Fire Store
    await this.getAdmin();

    if (this.hasAdmin == true) {

      // Create a new Pool object
      let tempPool: Pool = {
        name: this.name,
        description: this.description,
        image: this.image,
        usersNumber: 0
      }

      // Add the Pool
      this.fireStore.addPool(tempPool);

    } else {
      console.log("Can't do it because user isn't admin")
    }
  }


  // Delete a pool
  async deletePool(name: string) {

    // Check if user is admin and add a new pool inside Fire Store
    await this.getAdmin();

    if (this.hasAdmin == true) {

      // Delete the Pool
      this.fireStore.removePool(name);
    }
  }

}
