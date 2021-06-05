import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
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
  nickField: string;
  descriptionField: string;


  constructor(
    public userService: UserService,
    private menu: MenuController,
    private auth: FauthService,
  ) {

    //Get current user
    this.getUser();
  }


  //Get Fire Store User
  async getUser() {

    //Get current FireAuth user
    await this.auth.getCurrentUser().subscribe(

      data => {

        //Get the equivalent User on FireStore
        this.userService.getUserByUid(data.uid).subscribe(

          user => this.currentUser = user
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

    //Save username
    if (this.nickField != this.currentUser.nick) {

      await this.userService.saveUserNick(this.currentUser.uid, this.nickField).then(

        () => console.log("Nick saved!")

      ).catch(error => console.log(error));
    }

    //Save description
    if (this.descriptionField != this.currentUser.description) {

      await this.userService.saveUserDescription(this.currentUser.uid, this.descriptionField).then(

        () => console.log("Description saved!")

      ).catch(error => console.log(error));
    }

    //Go back to read mode
    this.goToRead();

  }

}
