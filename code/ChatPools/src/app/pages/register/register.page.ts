import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { FauthService } from 'src/app/services/fauth.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})


export class RegisterPage implements OnInit {

  //Variables
  firstTimeWrite: boolean = true;
  email: string;
  password: string;
  repPassword: string;
  username: string = "";
  validNick: boolean = false;
  private checkUserSubscription: Subscription = new Subscription();


  constructor(
    private auth: FauthService,
    public alert: AlertController,
    private menu: MenuController,
    private router: Router,
    private userService: UserService
  ) {}


  ngOnInit() {}


  //Animate the SVG before entering to avoid black lines
  ionViewWillEnter() {

    //SVG
    this.setTextAnimation(0.1,3,2.5,'ease-in-out','#2660cf',false);

    //Log out from current user
    this.auth.logout();
  }


  //Using ionViewDidEnter instead ionViewWillEnter prevents missing menu hide animation
  ionViewDidEnter() {

    //Disable Menu
    this.menu.enable(false);
  }


  //Set firstTimeWrite to false after writing on username input
  setFirstTime() {
    this.firstTimeWrite = false;
    console.log("First time is false");
  }


  //Check if an User with the same Nick exists
  checkUser() {

    this.checkUserSubscription = this.userService.getUsersWithNick(this.username).subscribe(

      data => {

        console.log("Matching nick user: " + data);

        //If an User has the nick taken user can't register
        if (data.length != 0) this.validNick = false;
        //Else it can
        else this.validNick = true;
      }
    ); 
  }
      

  //Try to register and redirect to allpools
  async tryRegister() {

    //If an User has the nick taken show alert
    if (!this.validNick) this.showErrorAlert("nick-taken");

    //Else continue with the register
    else {

      //Log out from current user
      await this.auth.logout();

      //Create new user
      this.auth.createUser(this.email, this.password).then(

        async data => {

          //Create a new User object
          let tempUser: User = {
            uid: data.user.uid,
            nick: this.username,
            isBanned: false
          }
        
          //Add a new User inside Fire Store
          this.userService.createFireStoreUser(tempUser).then(

            () => {

              console.log("User successfully written");
              this.checkUserSubscription.unsubscribe();
              this.router.navigateByUrl("/tabs/tab1", { replaceUrl: true });
            }
          ).catch(error => this.showErrorAlert(error.code));
        }

      //Catch any errors during register
      ).catch(error => this.showErrorAlert(error.code));
    }
  }


  //Show an alert with the register error with a custom message
  async showErrorAlert(errorCode) {

    console.log(errorCode)

    let customMessage;

    //Custom error messages
    if (errorCode == "auth/argument-error") {
      customMessage = "Fields can't be let empty."
    }

    if (errorCode == "auth/invalid-email") {
      customMessage = "The email adress seems wrong."
    }

    if (errorCode == "auth/weak-password") {
      customMessage = "The password is too weak."
    }

    if (errorCode == "auth/email-already-in-use") {
      customMessage = "The email is already in use."
    }

    if (errorCode == "nick-taken") {
      customMessage = "The username is already in use."
    }

    //Create alert
    const alert = await this.alert.create({
      header: 'There was an error',
      message: customMessage,
      buttons: ['Ok']
    });

    await alert.present();
  }


  //SVG animation
  setTextAnimation(delay, duration, strokeWidth, timingFunction, strokeColor,repeat) {

      let paths = document.querySelectorAll("path");
      let mode = repeat?'infinite':'forwards';

      for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          const length = path.getTotalLength();
          path.style["stroke-dashoffset"] = `${length}px`;
          path.style["stroke-dasharray"] = `${length}px`;
          path.style["stroke-width"] = `${strokeWidth}px`;
          path.style["stroke"] = `${strokeColor}`;
          path.style["animation"] = `${duration}s svg-text-anim ${mode} ${timingFunction}`;
          path.style["animation-delay"] = `${i * delay}s`;
      }
  }



}
