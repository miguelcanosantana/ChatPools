import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Pool } from '../model/pool';
import { FirestoreService } from '../services/firestore.service';
import { AlertController } from '@ionic/angular';


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
    public alert: AlertController
  ) {

    // Get all pools and subscribe
    this.fireStore.getPools().subscribe(
      data => this.allPools = data
    );

    // Get if user has admin for the first time
    this.getAdmin();

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
    await this.getAdmin().then(

      () => {

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
          console.log("Can't create pool")
        }
      }
    )
  }


  // Alert for deleting a pool
  async deletePoolAlert(name: string) {
    const alert = await this.alert.create({
      header: 'Confirm delete!',
      message: "Do you want to delete the pool <strong>" + name + "</strong>? <br> <br> Deleting a pool will delete all of it's messages." ,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Delete it!',
          handler: () => this.deletePool(name)
        }
      ]
    });

    await alert.present();
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
