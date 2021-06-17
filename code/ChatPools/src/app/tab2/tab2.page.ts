import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
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
  private fauthSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();
  private getPoolsSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    public auth: FauthService,
    private poolsService: PoolsService,
    public userService: UserService,
    private platform: Platform
  ) {

    //Back button (Exit App)
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
    });
  }


  //Get User and Pools
  async ionViewWillEnter() {

    //Get current user
    await this.getUser();
  }


  //Get Fire Store User
  async getUser() {

    //Get current FireAuth user
    this.fauthSubscription = await this.auth.getCurrentUser().subscribe(

      async data => {

        //Get the equivalent User on FireStore
        this.userSubscription = await this.userService.getUserByUid(data.uid).subscribe(

          async user => {

            this.currentUser = user;

            //Redirect if user is banned
            if (user.isBanned == true) this.router.navigateByUrl("login/banned");

            //Get all pools and subscribe
            this.getPoolsSubscription = await this.poolsService.getPools().subscribe(
              data => this.allPools = data
            );
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


  //Close all subscriptions
  ionViewWillLeave() {
    this.fauthSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.getPoolsSubscription.unsubscribe();
  }

}
