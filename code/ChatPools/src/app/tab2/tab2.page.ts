import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Pool } from '../model/pool';
import { FauthService } from '../services/fauth.service';
import { PoolsService } from '../services/pools.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page {

  //Variables
  allPools: Pool[] = [];
  

  constructor(
    private router: Router,
    public auth: FauthService,
    private poolsService: PoolsService
  ) {

    //Get all pools and subscribe
    this.poolsService.getPools().subscribe(
      data => this.allPools = data
    );
  }


  //Go to group description
  goToGroupDescription(name: string) {

    try {

      this.router.navigateByUrl(`/description${name != undefined ? '/' + name : ''}`);
    
    } catch (error) {
      console.log("Error entering the chat");
    }
  }

}
