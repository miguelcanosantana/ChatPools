import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {


  // Variables
  email: string;
  password: string;


  constructor(
    private auth: AuthService,
    public alert: AlertController,
    private menu: MenuController,
    private router: Router
    ) { }


  ngOnInit() {}


  //Using ionViewDidEnter instead ionViewWillEnter prevents missing menu hide animation
  ionViewDidEnter() {

    //Disable Menu
    this.menu.enable(false);
  }


  // Try to login and redirect to allpools
  async tryLogin() {

    // Log out from current user
    this.auth.logout();

    // Log in with new user
    this.auth.login(this.email, this.password).then(

      data => {

        console.log("User has been logged");
        this.router.navigateByUrl("/allpools")
      }

      // Catch any errors during login
    ).catch(error => this.showErrorAlert(error.code));
  }


  // Show an alert with the login error with a custom message
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

    if (errorCode == "auth/user-not-found") {
      customMessage = "User doesn't exist."
    }

    if (errorCode == "auth/wrong-password") {
      customMessage = "The password is incorrect."
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
