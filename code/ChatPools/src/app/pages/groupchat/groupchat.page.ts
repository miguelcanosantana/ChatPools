import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, MenuController } from '@ionic/angular';
import { Groupmessage } from 'src/app/model/groupmessage';
import { Pool } from 'src/app/model/pool';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

declare function require(name:string);
var Filter = require('bad-words');


@Component({
  selector: 'app-groupchat',
  templateUrl: './groupchat.page.html',
  styleUrls: ['./groupchat.page.scss'],
})


export class GroupchatPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  dummyList: any;


  // Variables
  pool: Pool;
  messageText: string;
  currentUser: User;
  allMessages: Groupmessage[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    public fireStore: FirestoreService,
    private menu: MenuController,
    private auth: AuthService
  ) {

    // Get current user
    this.getUser();

    // Get Pool name from the url
    const poolName = this.activatedRoute.snapshot.paramMap.get('chat');

    // Get Pool
    this.fireStore.getPoolByName(poolName).subscribe(

      data => this.pool = data
    )

    // Get messages
    this.fireStore.getMessages(poolName).subscribe(

      data => {
        this.allMessages = data
      }
    )
  }


  ngOnInit() {}


  //Using ionViewDidEnter instead ionViewWillEnter prevents missing menu hide animation
  ionViewDidEnter() {

    //Disable Menu
    this.menu.enable(false);
  }


  // Sleep x seconds
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  // Get Fire Store User
  async getUser() {

    // Get current FireAuth user
    await this.auth.getCurrentUser().subscribe(

      data => {

        // Get the equivalent User on FireStore
        this.fireStore.getUserByUid(data.uid).subscribe(

          user => this.currentUser = user
        )
      }
    );
  }


  // Get Nick by User id
  getNick(userId: string) {

    console.log("Entered")

    let tempNick: string;

    // Get the equivalent User on FireStore
    this.fireStore.getUserByUid(userId).subscribe(

      user => tempNick = user.nick
    ).unsubscribe()

  }


  // Send message
  async sendMessage() {

    await this.getUser();

    // If the User exists
    if (this.currentUser) {

      console.log("User exists")

      // If User is not banned create and send message
      if (!this.currentUser.isBanned) {

        console.log("User can send messages")

        let currentTime: Date = new Date();

        let tempMessage: Groupmessage = {

          userId: this.currentUser.uid,
          content: this.messageText,
          isDeleted: false,
          time: currentTime
        }

        // Try sending the message
        try {

          // Filter the message
          let customFilter = new Filter({ placeHolder: '🐤'});
          tempMessage.content = customFilter.clean(tempMessage.content);

          // Ad to Fire Store
          this.fireStore.addMessage(this.pool.name, tempMessage);

          // Clear message
          this.messageText = "";

          // Scroll to the bottom of the page
          var titleELe = document.getElementById("bottom");
          this.content.scrollToPoint(0, titleELe.offsetTop, 500);

        } catch (error) {
          console.log(error);
        }
      }
    }
  }

}
