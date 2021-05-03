import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})


export class RegisterPage implements OnInit {


  // Variables
  email: string;
  password: string;
  repPassword: string;
  username: string;


  constructor(
    private auth: AuthService,
    public alert: AlertController,
    private menu: MenuController,
    private router: Router,
    private fireStore: AngularFirestore
  ) { }


  ngOnInit() {}


  //Using ionViewDidEnter instead ionViewWillEnter prevents missing menu hide animation
  ionViewDidEnter() {

    //Disable Menu
    this.menu.enable(false);
  }


  // Try to register and redirect to allpools
  async tryRegister() {

    // Log out from current user
    this.auth.logout();

    // Create new user
    this.auth.createUser(this.email, this.password).then(

      data => {

        //Create a new User object
        let tempUser: User = {
          uid: data.user.uid,
          nick: this.username
        }

        // Add a new user inside Fire Store
        this.fireStore.collection('users/').doc(data.user.uid).set(tempUser).then(() => {

          console.log("User successfully written");

        }).catch((error) => {
          console.error(error => this.showErrorAlert(error.code));
        });

        console.log("User has been registered");
        this.router.navigateByUrl("/allpools");
      }

      

      // Catch any errors during register
    ).catch(error => this.showErrorAlert(error.code));
  }


  // Show an alert with the register error with a custom message
  async showErrorAlert(errorCode) {

    console.log(errorCode)

    let customMessage;

    // Custom error messages
    if (errorCode == "auth/argument-error") {
      customMessage = "Fields can't be let empty."
    }

    if (errorCode == "auth/invalid-email") {
      customMessage = "The email adress seems wrong."
    }

    if (errorCode == "auth/weak-password") {
      customMessage = "The password is too weak."
    }


    // Create alert
    const alert = await this.alert.create({
      header: 'There was an error',
      message: customMessage,
      buttons: ['Ok']
    });

    await alert.present();
  }


  // Redirect to register page
  goToRegister() {
    this.router.navigateByUrl("/register")
  }



  

}
