import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, Platform, ToastController } from '@ionic/angular';
import { User } from '../model/user';
import { FauthService } from '../services/fauth.service';
import { UserService } from '../services/user.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImagesService } from '../services/images.service';
import { Subscription } from 'rxjs';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page {


  //Variables
  readMode: boolean = true;
  currentUser: User;
  nickField: string = "";
  descriptionField: string;
  validNick: boolean = false;
  hasRedirected: boolean = false;
  private fauthSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();
  private checkSubscription: Subscription = new Subscription();

  constructor(
    public userService: UserService,
    private menu: MenuController,
    private auth: FauthService,
    public toast: ToastController,
    private router: Router,
    private imagesService: ImagesService,
    public alert: AlertController,
    private platform: Platform
  ) {

    //Back button (Exit App)
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
    });
  }


  //Get user
  async ionViewWillEnter() {

    //Set redirected as false
    this.hasRedirected = false;

    await this.getUser();
  }


  //Check if an User with the same Nick exists
  async checkUser() {

    this.checkSubscription = await this.userService.getUsersWithNick(this.nickField).subscribe(

      data => {

        console.log("Matching nick user: " + data);

        //If an User has the nick taken user can't register
        if (data.length != 0) this.validNick = false;
        //Else it can
        else this.validNick = true;
      }
    ); 
  }


  //Show toast with error
  async showError(error: string) {

    let msg: string;

    if (error == "user-taken") msg = "The username is already taken."; 

    const toast = await this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


  //Get Fire Store User
  async getUser() {

    //Get current FireAuth user
    this.fauthSubscription = await this.auth.getCurrentUser().subscribe(

      async data => {

        //Get the equivalent User on FireStore
        this.userSubscription = await this.userService.getUserByUid(data.uid).subscribe(

          user => {

            this.currentUser = user;
            console.log("User info updated");

            //Redirect if user is banned
            if (user.isBanned == true && this.hasRedirected == false) {
              this.hasRedirected = true;
              this.router.navigateByUrl("login/banned");
            }
          }
        )
      }
    );
  }


  //Launch edit mode
  goToEdit() {
    this.readMode = false;
    this.nickField = this.currentUser.nick;
    this.descriptionField = this.currentUser.description;
  }


  //Go to read mode
  goToRead() {
    this.readMode = true;  
  }


  //Save changes
  async saveChanges() {

    //Save username if nick is valid
    if ((this.nickField != this.currentUser.nick) && this.validNick) {

      await this.userService.saveUserNick(this.currentUser.uid, this.nickField).then(

        () => console.log("Nick saved!")

      ).catch(error => console.log(error));

    //Show user taken toast  
    } else if ((this.nickField != this.currentUser.nick) && !this.validNick) this.showError("user-taken");

    //Save description
    if (this.descriptionField != this.currentUser.description) {

      await this.userService.saveUserDescription(this.currentUser.uid, this.descriptionField).then(

        () => console.log("Description saved!")

      ).catch(error => console.log(error));
    }

    //Go back to read mode
    this.goToRead();
  }


  //Logout
  async logout() {
    await this.auth.logout();

    if (this.hasRedirected == false) {
      this.hasRedirected = true;
      this.router.navigateByUrl("login");
    }
  }


  //Take or load picture
  async takePicture() {

    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: false,
      source: CameraSource.Prompt,
      resultType: CameraResultType.Base64
    });

    let imageBase = image.base64String;
    console.log(imageBase)

    const isAvatar: boolean = true;

    //Upload the image
    let uploadedImageUrl;

    this.imagesService.uploadImage(isAvatar, imageBase, this.currentUser.uid).then(

      data => {

        console.log(data.state)

        //Get the url
        data.ref.getDownloadURL().then(

          url => {
            
            uploadedImageUrl = url;
            
            //Save the url in the avatar
            this.userService.saveUserAvatar(this.currentUser.uid, uploadedImageUrl).then(

            ).catch(error => this.showErrorAlert(error));

          }

        ).catch(error => this.showErrorAlert(error));

      }

    ).catch(error => this.showErrorAlert(error));
  }


  //Show an alert with the upload image error
  async showErrorAlert(error) {

    console.log(error);

    //Create alert
    const alert = await this.alert.create({
      header: 'There was an error',
      message: error,
      buttons: [
        {
          text: "Okey",
          handler: () => {}
        }
      ]
    });

    await alert.present();
  }


  //Close all subscriptions
  ionViewWillLeave() {
    this.fauthSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.checkSubscription.unsubscribe();
  }

}
