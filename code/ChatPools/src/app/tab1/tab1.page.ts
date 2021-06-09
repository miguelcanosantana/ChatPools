import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { User } from '../model/user';
import { FauthService } from '../services/fauth.service';
import { UserService } from '../services/user.service';


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


  constructor(
    public userService: UserService,
    private menu: MenuController,
    private auth: FauthService,
    public toast: ToastController,
    private router: Router
  ) {

    //Get current user
    this.getUser();
  }


  //Check if an User with the same Nick exists
  checkUser() {

    this.userService.getUsersWithNick(this.nickField).subscribe(

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
    await this.auth.getCurrentUser().subscribe(

      data => {

        //Get the equivalent User on FireStore
        this.userService.getUserByUid(data.uid).subscribe(

          user => {

            this.currentUser = user;

            //Redirect if user not logged or deleted
            if (!user || user.isBanned) this.router.navigateByUrl("login/banned");
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
    this.router.navigateByUrl("login");
  }

}
