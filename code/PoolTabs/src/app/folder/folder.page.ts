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
import { Report } from '../model/report';
import { ReportsService } from '../services/reports.service';


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
  private allUsersSubscription: Subscription = new Subscription();
  private getPoolByNameSubscription: Subscription = new Subscription();
  private getUserByUidSubscription: Subscription = new Subscription();
  private getUserReportsSubscription: Subscription = new Subscription();
  
  poolInput: string = "";
  listOfPools: Pool[] = [];
  filteredPools: Pool[] = [];
  selectedPool: Pool;
  poolDescriptionInput: string;
  newPoolNameInput: string;
  newPoolDescriptionInput: string;
  newPoolImageUrl: string;

  userInput: string = "";
  selectedUser: User;
  listOfUsers: User[] = [];
  filteredUsers: User[] = [];
  userReports: Report[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private fauth: FireAuthService,
    private userService: UserService,
    private router: Router,
    public menu: MenuController,
    private poolsService: PoolsService,
    public alert: AlertController,
    public toast: ToastController,
    private imagesService: ImagesService,
    private reportsService: ReportsService
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
            this.poolsSubscription = this.poolsService.getPools().subscribe(

              pools => this.listOfPools = pools
            );

            //Start a subscription to all users
            this.allUsersSubscription = this.userService.getUsers().subscribe(

              users => this.listOfUsers = users
            );
          }
        );
      }
    );
  }


  //Delete Report
  async deleteReport(report: Report) {

    this.reportsService.deleteReport(report).then(

      () => this.showToast("Report deleted.", 2000)

    ).catch(error => this.showErrorAlert(error));

  }


  //Filter Users by name if input contains something
  filterUsers() {

    //Reset the filter
    this.filteredUsers = [];
    
    //Filter Users
    this.listOfUsers.filter(
      
      (user) => {
        
        if (user.nick.toLocaleLowerCase().startsWith(this.userInput.toLocaleLowerCase())) {
          this.filteredUsers.unshift(user);
        }
      }
    );
  }


  //Get an User from FireStore
  async getUser(uid: string) {

    //Check that you don't get yourself
    if (uid != this.currentUser.uid) {

      this.getUserByUidSubscription = await this.userService.getUserByUid(uid).subscribe(

        data => {
          
          this.selectedUser = data;
        
          //Get User reports
          this.getUserReportsSubscription = this.reportsService.getReports(data.uid).subscribe(

            reports => this.userReports = reports
          );
        }
      );
      
    } else this.showToast("You can't modify your own user.");
  }


  //Clear the User
  clearUser() {
    this.selectedUser = null;
  }


  //Promote user
  async promoteUser(promotionType: string) {

    await this.userService.promoteUser(this.selectedUser.uid, promotionType).then(

      () => {this.showToast("The user has been promoted.")}

    ).catch(error => this.showErrorAlert(error));
  }


  //Promote user
  async demoteUser(demotionType: string) {

    //Create alert
    const alert = await this.alert.create({
      header: 'Demote the User',
      message: 'You are going to DEMOTE the user ' + this.selectedUser.nick +", you can still promote it after, are you sure?",

      buttons: [
        {
          text: "Go back",
          handler: () => {}
        },
        {
          text: "Demote the User",
          handler: async () => {

            await this.userService.demoteUser(this.selectedUser.uid, demotionType).then(

              () => {this.showToast("The user has been demoted.")}
        
            ).catch(error => this.showErrorAlert(error));
          }
        }
      ]
    });

    await alert.present();
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
            .catch(error => this.showErrorAlert(error));
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
            .catch(error => this.showErrorAlert(error));
          }
        }
      ]
    });

    await alert.present();
  }


  //Show Toast with a message
  async showToast(msg: string, time?: number) {

    let toast = await this.toast.create({
      message: msg,
      duration: 3000
    });

    //If given time use it instead default
    if (time) toast.duration = time;

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
    this.getUserByUidSubscription.unsubscribe();
    this.allUsersSubscription.unsubscribe();
  }

}
