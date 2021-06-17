import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from '../model/user';
import { FireAuthService } from '../services/fire-auth.service';
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


  constructor(
    private activatedRoute: ActivatedRoute,
    private fauth: FireAuthService,
    private userService: UserService,
    private router: Router,
    public menu: MenuController
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
          }
        );
      }
    );
  }


  //Delete subscriptions
  ionViewWillExit() {
    this.fauthSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
