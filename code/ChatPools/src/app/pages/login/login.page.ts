import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CheckuserService } from 'src/app/services/checkuser.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  //Variables
  email: string;
  password: string;


  constructor(
    private auth: AuthService,
    private checkUser: CheckuserService
    ) { }


  ngOnInit() {}


  async tryLogin() {

    
    let signedUid;

    //Check if there is a previous uid to remove it
    this.checkUser.getUid().then(
      data => {
        signedUid = data;

        if (signedUid) this.checkUser.removeUid();

        //Login the new user
        this.auth.login(this.email, this.password);

      }
    )


    this.auth.login
  }

}
