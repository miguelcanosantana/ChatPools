import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from '../model/user';
import { UserPool } from '../model/user-pool';
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
  searchInput: string = "";
  userPools: UserPool[] = [];
  userFilteredPools: UserPool[] = [];
  hasFiltered: boolean;
  hasRedirected: boolean = false;
  private fauthSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();
  private getPoolsUserSubscription: Subscription = new Subscription();
  private getPoolsImagesSubscription: Subscription = new Subscription();


  constructor(
    private auth: FauthService,
    public userService: UserService,
    public poolsService: PoolsService,
    private router: Router,
    private alert: AlertController,
    private platform: Platform
  ) {

    //Back button (Exit App)
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
    });
  }

  //Get user in ionViewWillEnter to avoid mixing users pools while the info is loading
  async ionViewWillEnter() {

    //Set redirected as false
    this.hasRedirected = false;

    //Reset search Input
    this.searchInput = "";
    this.hasFiltered = false;

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
            if (user.isBanned == true && this.hasRedirected == false) {
              this.hasRedirected = true;
              this.router.navigateByUrl("login/banned");
            }

            //Get pools from the user
            this.getPoolsUserSubscription = await this.userService.getPoolsFromUser(user.uid).subscribe(

              pools => {
                
                this.userPools = pools;

                //Filter once so all Pools appear
                if (!this.hasFiltered) {
                  this.filterPools();
                  this.hasFiltered = true;
                }

                //Get Pools images
                this.userPools.forEach(async pool => {

                  this.getPoolsImagesSubscription = await this.poolsService.getPoolByName(pool.name).subscribe(

                    data =>
                      pool.image = data.image
                  );
                });
              }
            );
          }
        );
      }
    );
  }


  //Filter Pools by name if input contains something
  filterPools() {

    //Reset the filter
    this.userFilteredPools = [];
    
    //Filter Pools
    this.userPools.filter(
      
      (pool) => {
        
        if (pool.name.toLocaleLowerCase().startsWith(this.searchInput.toLocaleLowerCase())) {
          this.userFilteredPools.unshift(pool);
        }
        
      }
    );
  }

  //Go to chat
  goToGroup(name: string) {

    try {

      if (this.hasRedirected == false) {
        this.hasRedirected = true;
        this.router.navigateByUrl(`/group${name != undefined ? '/' + name : ''}`);
      }
    
    } catch (error) {
      console.log("Error entering the chat");
    }
  }


  //Show an alert for deleting the Pool
  async showDeleteAlert(poolName: string) {

    //Create alert
    const alert = await this.alert.create({
      header: 'Exit the Pool',
      message: 'You are going to exit the pool ' + poolName +', you can join it again if you want.',

      buttons: [
        {
          text: "Go back",
          handler: () => {}
        },
        {
          text: "Exit the Pool",
          handler: () => {

            //Delete the Pool from user's folder in FireStore
            this.userService.deletePoolOfUser(this.currentUser.uid, poolName).then()
            .catch(error => console.log(error));
          }
        }
      ]
    });

    await alert.present();
  }


  //Close all subscriptions
  ionViewWillLeave() {
    this.fauthSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.getPoolsUserSubscription.unsubscribe();
    this.getPoolsImagesSubscription.unsubscribe();
  }

}
