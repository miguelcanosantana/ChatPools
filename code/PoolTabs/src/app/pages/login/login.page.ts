import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {


  //Variables
  currentUser: User;
  hasRedirected: boolean;
  email: string;
  password: string;
  private fauthSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();

  constructor(
    private fauth: FireAuthService,
    private userService: UserService,
    private router: Router,
    private alert: AlertController,
    public menu: MenuController
  ) {}


  ngOnInit() {}


  ionViewWillEnter() {

    //Close menu
    this.menu.close();

    //Erase the previous redirect
    this.hasRedirected = false;

    //Close previous user session
    this.fauth.logout();
  }


  ionViewDidEnter() {

    //Disable Menu
    this.menu.enable(false);
  }


  //Try to login and redirect to the admin panel
  async tryLogin() {

    //Log in with user
    await this.fauth.login(this.email, this.password).then(

      async data => {

        //Get the equivalent User on FireStore
        this.userSubscription = await this.userService.getUserByUid(data.user.uid).subscribe(

          async user => {

            this.currentUser = user;

            //If User is not banned and it's admin
            if (user.isAdmin && !user.isBanned && !this.hasRedirected) {
              this.hasRedirected = true;
              this.router.navigateByUrl("");

            //Else show error
            } else this.showErrorAlert("banned-admin");
          }
        );

      }

      // Catch any errors during login
    ).catch(error => this.showErrorAlert(error.code));
  }


  //Show an alert with the login error with a custom message
  async showErrorAlert(errorCode) {

    console.log(errorCode);

    let customMessage;

    //Custom error messages
    if (errorCode == "auth/argument-error") {
      customMessage = "Fields can't be let empty."
    }

    if (errorCode == "auth/invalid-email") {
      customMessage = "The email adress seems wrong."
    }

    if (errorCode == "auth/user-not-found") {
      customMessage = "User doesn't exist."
    }

    if (errorCode == "auth/wrong-password") {
      customMessage = "The password is incorrect."
    }

    if (errorCode == "banned-admin") {
      customMessage = "The user isn't admin or has been banned."
    }

    //Create alert
    const alert = await this.alert.create({
      header: 'There was an error',
      message: customMessage,
      buttons: [
        {
          text: "Okey",
          handler: () => {
          }
        }
      ]
    });
      
    await alert.present();
  }

}
