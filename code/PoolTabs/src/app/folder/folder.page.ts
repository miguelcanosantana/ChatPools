import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pool } from '../model/pool';
import { User } from '../model/user';
import { FireAuthService } from '../services/fire-auth.service';
import { PoolsService } from '../services/pools.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})


export class FolderPage implements OnInit {


  //Variables
  currentUser: User;
  hasRedirected: boolean;
  public folder: string;
  private fauthSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();
  private poolsSubscription: Subscription = new Subscription();
  private getPoolByNameSubscription: Subscription = new Subscription();
  
  poolInput: string = "";
  listOfPools: Pool[] = [];
  filteredPools: Pool[] = [];
  selectedPool: Pool;
  poolDescriptionInput: string;
  poolImageInput: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private fauth: FireAuthService,
    private userService: UserService,
    private router: Router,
    public menu: MenuController,
    private poolsService: PoolsService,
    public alert: AlertController,
    public toast: ToastController
    ) { }


  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }


  ionViewWillEnter() {

    //Enable menu
    this.menu.enable(true);

    //Erase the previous redirect
    this.hasRedirected = false;

    //Get Fire Auth User
    this.fauthSubscription = this.fauth.getCurrentUser().subscribe(

      data => {

        //Get FireStore User
        this.userSubscription = this.userService.getUserByUid(data.uid).subscribe(

          user => {

            this.currentUser = user;

            //If User is not admin or banned, redirect once with a debounce
            if ((!user.isAdmin || user.isBanned) && !this.hasRedirected) {

              this.hasRedirected = true;
              this.router.navigateByUrl("/login");            
            }

            //Start a subscription to all pools
            this.poolsService.getPools().subscribe(

              pools => this.listOfPools = pools
            );
          }
        );
      }
    );
  }


  //Filter Pools by name if input contains something
  filterPools() {

    //Reset the filter
    this.filteredPools = [];
    
    //Filter Pools
    this.listOfPools.filter(
      
      (pool) => {
        
        if (pool.name.toLocaleLowerCase().startsWith(this.poolInput.toLocaleLowerCase())) {
          this.filteredPools.unshift(pool);
        }
        
      }
    );
  }


  //Get a Pool from FireStore
  async getPool(name: string) {

    this.getPoolByNameSubscription = await this.poolsService.getPoolByName(name).subscribe(

      data => {

        this.selectedPool = data;

        //Update the input
        this.poolDescriptionInput = data.description;
      }
    );
  }


  //Clear the Pool
  clearPool() {
    this.selectedPool = null;
  }


  //Update the Pool
  async updatePool() {

    //Update the description only
    if (this.poolDescriptionInput != this.selectedPool.description) {

      await this.poolsService.updatePoolName(this.selectedPool.name, this.poolDescriptionInput).then()
            .catch(error => console.log(error));
    }
  }


  //Delete the Pool
  async deletePool() {

    //Create alert
    const alert = await this.alert.create({
      header: 'Delete the Pool',
      message: 'You are going to DELETE the pool ' + this.selectedPool.name +", you can't recover the messages, are you sure?",

      buttons: [
        {
          text: "Go back",
          handler: () => {}
        },
        {
          text: "Delete the Pool",
          handler: () => {

            //Delete the Pool from FireStore
            this.poolsService.deletePool(this.selectedPool.name).then(

              () => this.deletePoolToast()
            )
            .catch(error => console.log(error));
          }
        }
      ]
    });

    await alert.present();
  }


  //Toast with Pool delete message
  async deletePoolToast() {

    let toast = await this.toast.create({
      message: 'The pool was deleted.',
      duration: 2000
    });

  }


  //Delete subscriptions
  ionViewWillExit() {
    this.fauthSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.poolsSubscription.unsubscribe();
    this.getPoolByNameSubscription.unsubscribe();
  }

}
