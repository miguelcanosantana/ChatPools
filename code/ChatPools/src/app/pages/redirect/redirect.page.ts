import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FauthService } from 'src/app/services/fauth.service';


@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.page.html',
  styleUrls: ['./redirect.page.scss'],
})


export class RedirectPage implements OnInit {

  //Variables
  path: string;


  constructor(
    private router: Router,
    private auth: FauthService
  ) { }


  async ngOnInit() {

    await this.checkUser();
    await this.sleep(1500);
    

    //If the route is null, redirect to the login screen
    if (!this.path) this.router.navigateByUrl("/login");
    //else navigate to the url
    else await this.router.navigateByUrl(this.path, { replaceUrl: true, skipLocationChange: true });
  }


  //Wait a minimum time to hide the loading screen
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  //Check if user is logged, save uid in local db and set url to redirect.
  async checkUser() {

    await this.auth.getCurrentUser().subscribe(
      data => {

        let user = data;
        if (user) this.path = "/tabs/tab3";
      }

    );
  }

}
