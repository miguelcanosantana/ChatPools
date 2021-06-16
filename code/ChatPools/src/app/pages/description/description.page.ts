import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pool } from 'src/app/model/pool';
import { User } from 'src/app/model/user';
import { FauthService } from 'src/app/services/fauth.service';
import { PoolsService } from 'src/app/services/pools.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
})


export class DescriptionPage implements OnInit {


  //Variables
  currentUser: User;
  currentPool: Pool;
  showContent: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public userService: UserService,
    private auth: FauthService,
    private poolsService: PoolsService
    ) {}


  async ngOnInit() {

    //Get Pool name from the url
    const poolName = this.activatedRoute.snapshot.paramMap.get('chat');

    //Get pool
    this.getPool(poolName);

    await this.sleep(500);

    //Get current user
    await this.getUser();
  }


  //Wait a minimum time to hide the loading screen
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  //Get Fire Store User
  async getUser() {

    //Get current FireAuth user
    await this.auth.getCurrentUser().subscribe(

      data => {

        //Get the equivalent User on FireStore
        this.userService.getUserByUid(data.uid).subscribe(

          user => {

            this.currentUser = user;

            //Redirect if user is banned
            if (user.isBanned == true) this.router.navigateByUrl("login/banned");
            //Else check if User is already in pool and redirect if so
            else {

              this.userService.getPoolOfUserByName(this.currentUser.uid, this.currentPool.name).subscribe(

                data => {
  
                    if (data) this.goToGroup(this.currentPool.name);
                    //If user is not in Pool show page content
                    else this.showContent = true;
                  }
              );
            }
            
          }
        )
      }
    );
  }


  //Get Pool from FireStore
  async getPool(poolName: string) {

    await this.poolsService.getPoolByName(poolName).subscribe(

      data => this.currentPool = data
    );
  }


  //Join and go to group
  async joinGroup() {
    await this.userService.savePoolOnUser(this.currentUser.uid, this.currentPool.name).then(

      () => this.goToGroup(this.currentPool.name)
    );
  }
 

  //Go to chat
  goToGroup(name: string) {

    try {

      this.router.navigateByUrl(`/group${name != undefined ? '/' + name : ''}`);
    
    } catch (error) {
      console.log("Error entering the chat");
    }
  }

}
