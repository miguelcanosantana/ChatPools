import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.page.html',
  styleUrls: ['./redirect.page.scss'],
})
export class RedirectPage implements OnInit {

  //Variable
  path: string;


  constructor(
    private router: Router,
    private authService: AuthService
    ) { }


  async ngOnInit() {

    await this.checkUser();
    await this.sleep(1500);
    await this.router.navigateByUrl(this.path);

    // If the route is null, redirect to the login screen
    if (!this.path) this.router.navigateByUrl("/login");
  }


  // Wait a minimum time to hide the loading screen
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  // Check if user is logged, save uid in local db and set url to redirect.
  async checkUser() {

    await this.authService.getCurrentUser().subscribe(
      data => {

        let user = data;
        if (user) this.path = "/mypools";
      }

    );
  }

}


