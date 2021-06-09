import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { FauthService } from '../services/fauth.service';
import { PoolsService } from '../services/pools.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})


export class Tab3Page {


  //Variables
  currentUser: User;
  

  constructor(
    private auth: FauthService,
    public userService: UserService,
    public poolsService: PoolsService,
    private router: Router
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

          user => {
            
            this.currentUser = user;
            
            //Redirect if user not logged or deleted
            if (!user || user.isBanned) this.router.navigateByUrl("login/banned");
          }
        )
      }
    );
  }


}
