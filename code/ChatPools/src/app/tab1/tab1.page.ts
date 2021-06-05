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

}
