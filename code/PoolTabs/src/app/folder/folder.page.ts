import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pool } from '../model/pool';
import { User } from '../model/user';
import { FireAuthService } from '../services/fire-auth.service';
import { PoolsService } from '../services/pools.service';
import { UserService } from '../services/user.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImagesService } from '../services/images.service';


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
  newPoolNameInput: string;
  newPoolDescriptionInput: string;
  newPoolImageUrl: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private fauth: FireAuthService,
    private userService: UserService,
    private router: Router,
    public menu: MenuController,
    private poolsService: PoolsService,
    public alert: AlertController,
    public toast: ToastController,
    private imagesService: ImagesService
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

              () => this.showToast("The pool was deleted.")
            )
            .catch(error => console.log(error));
          }
        }
      ]
    });

    await alert.present();
  }


  //Show Toast with a message
  async showToast(msg: string) {

    let toast = await this.toast.create({
      message: msg,
      duration: 4000
    });

    await toast.present();
  }


  //Upload Pool picture
  async uploadPoolPicture(mode: string) {

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      source: CameraSource.Prompt,
      resultType: CameraResultType.Base64
    });

    let imageBase = image.base64String;

    const isAvatar: boolean = false;

    //Upload the image
    let uploadedImageUrl;

    this.imagesService.uploadImage(isAvatar, imageBase, this.currentUser.uid).then(

      data => {

        //Get the url
        data.ref.getDownloadURL().then(

          url => {
            
            uploadedImageUrl = url;

            //If mode is New Pool
            if (mode == "new-pool") {

              //Save the url in the Input
              this.newPoolImageUrl = uploadedImageUrl;
            }

            //If mode is Update Pool
            if (mode == "update-pool") {

              //Save the url in the Pool
              this.poolsService.savePoolImage(this.selectedPool.name, uploadedImageUrl).then()
              .catch(error => this.showErrorAlert(error));
            }

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


  //Create the Pool in FireStore if all inputs are filled
  async createPool() {

    if (this.newPoolNameInput && this.newPoolDescriptionInput && this.newPoolImageUrl) {

      let tempPool: Pool = {
        name: this.newPoolNameInput,
        description: this.newPoolDescriptionInput,
        image: this.newPoolImageUrl,
        usersNumber: 0
      }

      //Upload the Pool and show toast if success
      this.poolsService.createPool(tempPool).then(

        () => {
          
          this.showToast("Pool has been uploaded.");

          //Delete and hide inputs
          this.newPoolNameInput = "";
          this.newPoolDescriptionInput = "";
          this.newPoolImageUrl = "";
        }

      ).catch(error => this.showErrorAlert(error));
    }

  }


  //Delete subscriptions
  ionViewWillExit() {
    this.fauthSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.poolsSubscription.unsubscribe();
    this.getPoolByNameSubscription.unsubscribe();
  }

}
