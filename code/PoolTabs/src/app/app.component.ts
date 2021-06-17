import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from './model/user';
import { FireAuthService } from './services/fire-auth.service';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})


export class AppComponent {


  //Variables
  fauthUid: string;
  currentUser: User;
  private fauthSubscription: Subscription = new Subscription();

  public appPages = [
    { title: 'Pools', url: '/folder/Pools', icon: 'water' },
    { title: 'Users', url: '/folder/Users', icon: 'people' },
    { title: 'Admins', url: '/folder/Admins', icon: 'shield-half' }
  ];


  constructor(
    public fauth: FireAuthService,
    public userService: UserService,
    private router: Router
    ) {}


    //Go to Login
    async goToLogin() {

      await this.router.navigateByUrl("login");
      await this.fauth.logout();
    }

}
