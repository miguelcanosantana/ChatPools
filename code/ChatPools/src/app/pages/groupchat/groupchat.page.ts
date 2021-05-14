import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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


  // Variables
  pool: Pool;
  messageText: string;
  currentUser: User;
  allMessages: Groupmessage[] = [];
  newSession: boolean = true;


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

    // Get messages and update avatars and nicks
    this.fireStore.getMessages(poolName).subscribe(

      async data => {

        // Only if session is not new, else update everything
        if (!this.newSession) {

          // Only update if there are more than just 1 sent message by the user
          if (data.length == this.allMessages.length) {

            let hasIntegrity = true;

            // Check messages integrity
            for (let m = 0; m < data.length; m++) {
              if (data[m].id != this.allMessages[m].id) hasIntegrity = false;
            }

            // Update all if no integrity
            if (!hasIntegrity) {

              console.log("No integrity, updating!")
              this.updateMessages(data);

            // If has integrity only update nicks and avatars
            } else {
              this.updateNicksAvatars();
              console.log("There's no need to retrieve messages");
            }

          // If the lenght isn't the same just update all, because it doesn't have any integrity
          } else {
            this.updateMessages(data);
          }

        // If new session
        } else {
          
          this.updateMessages(data);
          this.newSession = false;
        }

        
      }
    )
  }


  ngOnInit() {}


  // Using ionViewDidEnter instead ionViewWillEnter prevents missing menu hide animation
  ionViewDidEnter() {

    // Disable Menu
    this.menu.enable(false);
  }


  // Update Messages
  async updateMessages(data: Groupmessage[]) {

    this.allMessages = data;
    await this.updateNicksAvatars();
          
    //TODO Scroll (WORKS BUT UGLY)
    for (let i = 0; i < 50; i++) {
      await this.content.scrollToBottom();
      await this.sleep(10);
    }
  }


  // Get Nicks and Avatars from Fire Store and show them on the messages
  updateNicksAvatars() {

    for (let m = 0; m < this.allMessages.length; m++) {

      // If the nick or avatar are not locally in the message and the message isn't listed
      let tempUid = this.allMessages[m].userId;

      if ((!this.allMessages[m].localChatNick || !this.allMessages[m].localChatImage)) {

        this.fireStore.getUserByUid(tempUid).subscribe(

          data => {

            // Save nick
            this.allMessages[m].localChatNick = data.nick;

            // Save image and uid
            this.allMessages[m].localChatImage = data.image;
          }
        )
      } 
    }
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

          // Add message id
          tempMessage.id = tempMessage.userId + tempMessage.time;

          // Add to the message list
          this.allMessages.push(tempMessage);

          // Add to Fire Store
          this.fireStore.addMessage(this.pool.name, tempMessage);

          // Clear message text
          this.messageText = "";

          //TODO Scroll (WORKS BUT UGLY)
          for (let i = 0; i < 50; i++) {
            await this.content.scrollToBottom();
            await this.sleep(10);
          }

        } catch (error) {
          console.log(error);
        }
      }
    }
  }

}
function List(List: any, arg1: { read: any; }) {
  throw new Error('Function not implemented.');
}

