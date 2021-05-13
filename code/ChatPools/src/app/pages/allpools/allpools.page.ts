import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pool } from 'src/app/model/pool';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-allpools',
  templateUrl: './allpools.page.html',
  styleUrls: ['./allpools.page.scss'],
})


export class AllpoolsPage implements OnInit {

  // Variables
  allPools: Pool[] = [];


  constructor(
    public auth: AuthService,
    private fireStore: FirestoreService,
    private router: Router
  ) {

    // Get all pools and subscribe
    this.fireStore.getPools().subscribe(
      data => this.allPools = data
    );

  }


  ngOnInit() {}


  // Go to chat
  goToChat(name: string) {

    try {
      
      this.router.navigateByUrl(`/groupchat${name != undefined ? '/' + name : ''}`);
      
    } catch (error) {
      console.log("Error entering the chat");
    }

  }

}
