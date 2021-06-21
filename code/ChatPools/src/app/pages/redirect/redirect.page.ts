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
  hasRedirected: boolean = false;


  constructor(
    private router: Router,
    private auth: FauthService
  ) { }


  ngOnInit() {}


  //Set redirected as false
  ionViewWillEnter() {
    this.hasRedirected = false;
  }


  async ionViewDidEnter() {

    await this.checkUser();
    await this.sleep(2000);
    
    //If the route is null, redirect to the login screen
    if (!this.path && this.hasRedirected == false) {
      this.hasRedirected = true;
      this.router.navigateByUrl("/login");
    }

    //else navigate to the url
    else if (this.hasRedirected == false) {
      this.hasRedirected = true;
      await this.router.navigateByUrl(this.path);
    }

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
