import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Pool } from '../model/pool';
import { User } from '../model/user';
import { FauthService } from '../services/fauth.service';
import { PoolsService } from '../services/pools.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page {

  //Variables
  allPools: Pool[] = [];
  currentUser: User;

  constructor(
    private router: Router,
    public auth: FauthService,
    private poolsService: PoolsService,
    public userService: UserService
  ) {

    //Get current user
    this.getUser();

    //Get all pools and subscribe
    this.poolsService.getPools().subscribe(
      data => this.allPools = data
    );
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
            if (!user || user.isBanned) this.router.navigateByUrl("login/banned", { replaceUrl: true });
          }
        );
      }
    );
  }


  //Go to group description
  goToGroupDescription(name: string) {

    try {

      this.router.navigateByUrl(`/description${name != undefined ? '/' + name : ''}`);
    
    } catch (error) {
      console.log("Error entering the chat");
    }
  }

}
