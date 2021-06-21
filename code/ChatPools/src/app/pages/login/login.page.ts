import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { FauthService } from 'src/app/services/fauth.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {

  //Variables
  email: string;
  password: string;
  currentUser: User;
  userBanned: boolean = false;
  hasRedirected: boolean = false;
  private userSubscription: Subscription = new Subscription();

  constructor(
    private auth: FauthService,
    public alert: AlertController,
    private menu: MenuController,
    private router: Router,
    public userService: UserService,
    private activatedRoute: ActivatedRoute,
    private fauth: FauthService
  ) { }


  ngOnInit() {

    //Get user state from the url
    const userState = this.activatedRoute.snapshot.paramMap.get('state');

    if (userState == "banned") this.userBanned = true;
  }


  //Set redirected as false
  ionViewWillEnter() {
    this.hasRedirected = false;
  }


  //Using ionViewDidEnter instead ionViewWillEnter prevents missing menu hide animation
  ionViewDidEnter() {

    //Disable Menu
    this.menu.enable(false);
  }


  //Try to login and redirect to allpools
  async tryLogin() {

    //Log in with user
    await this.auth.login(this.email, this.password).then(

      async data => {

        //Get the equivalent User on FireStore
        this.userSubscription = await this.userService.getUserByUid(data.user.uid).subscribe(

          async user => {

            this.currentUser = user;

            //If User is not banned
            if (user.isBanned == false && this.hasRedirected == false) {
              this.hasRedirected = true;
              this.router.navigateByUrl("/tabs/tab2");
            }

            //Else show guide and logout
            else if (this.hasRedirected == false) {
              this.userBanned = true;
            }
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


  // Redirect to register page
  goToRegister() {

    if (this.hasRedirected == false) {
      this.hasRedirected = true;
      this.router.navigateByUrl("/register");
    }
  }


  //Close all subscriptions
  ionViewWillLeave() {
    this.userSubscription.unsubscribe();
  }

}
