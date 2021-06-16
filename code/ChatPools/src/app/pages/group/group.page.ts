import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, MenuController, ToastController } from '@ionic/angular';
import { Message } from 'src/app/model/message';
import { Pool } from 'src/app/model/pool';
import { User } from 'src/app/model/user';
import { FauthService } from 'src/app/services/fauth.service';
import { MessagesService } from 'src/app/services/messages.service';
import { PoolsService } from 'src/app/services/pools.service';
import { SoundService } from 'src/app/services/sound.service';
import { UserService } from 'src/app/services/user.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import * as Moment from 'moment';
import * as Filter from 'bad-words';
import { ImagesService } from 'src/app/services/images.service';
import { Report } from 'src/app/model/report';
import { ReportsService } from 'src/app/services/reports.service';



@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})


export class GroupPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  

  //Variables
  pool: Pool;
  messageText: string;
  currentUser: User;
  allMessages: Message[] = [];
  newSession: boolean = true;
  imageUrlHolder: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public poolsService: PoolsService,
    public messagesService: MessagesService,
    public userService: UserService,
    private menu: MenuController,
    private auth: FauthService,
    public soundService: SoundService,
    private router: Router,
    private imagesService: ImagesService,
    public alert: AlertController,
    private reportsService: ReportsService,
    public toast: ToastController
  ) { }


  ngOnInit() {

    //Get current user
    this.getUser();

    //Get Pool name from the url
    const poolName = this.activatedRoute.snapshot.paramMap.get('chat');

    //Get Pool
    this.poolsService.getPoolByName(poolName).subscribe(

      data => this.pool = data
    );

    //Get messages and update avatars and nicks
    this.messagesService.getMessages(poolName).subscribe(

      async data => {

        //Only if session is not new, else update everything
        if (!this.newSession) {

          // Only update if there are more than just 1 sent message by the user
          if (data.length == this.allMessages.length) {

            let hasIntegrity = true;

            //Check messages integrity
            for (let m = 0; m < data.length; m++) {
              if (data[m].id != this.allMessages[m].id) hasIntegrity = false;
            }

            //Update all if no integrity
            if (!hasIntegrity) {

              console.log("No integrity, updating!")
              this.updateMessages(data);

            //If has integrity only update nicks and avatars
            } else {
              this.updateNicksAvatars();
              console.log("There's no need to retrieve messages");
            }

          //If the lenght isn't the same just update all, because it doesn't have any integrity
          } else {
            this.updateMessages(data);
          }

        //If new session
        } else {
          
          this.updateMessages(data);
          this.newSession = false;
        }
      }
    );

  }


  //Using ionViewDidEnter instead ionViewWillEnter prevents missing menu hide animation
  ionViewDidEnter() {

    //Disable Menu
    this.menu.enable(false);
  }


  //Update Messages
  async updateMessages(data: Message[]) {

    this.allMessages = data;
    await this.updateNicksAvatars();
          
    //TODO Scroll (WORKS BUT UGLY)
    for (let i = 0; i < 50; i++) {
      await this.content.scrollToBottom();
      await this.sleep(10);
    }
  }


  //Get Nicks and Avatars from Fire Store and show them on the messages
  updateNicksAvatars() {

    for (let m = 0; m < this.allMessages.length; m++) {

      //If the nick or avatar are not locally in the message and the message isn't listed
      let tempUid = this.allMessages[m].userId;

      if ((!this.allMessages[m].localChatNick || !this.allMessages[m].localChatImage)) {

        this.userService.getUserByUid(tempUid).subscribe(

          data => {

            //If user was deleted set custom nick
            if (!data) this.allMessages[m].localChatNick = "Deleted User";
            //Else save specs
            else {

              //Save nick
              this.allMessages[m].localChatNick = data.nick;

              //Save image and uid
              this.allMessages[m].localChatImage = data.image;
            }
          }
        );
        
      } 
    }
  }


  //Sleep x seconds
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

          async user => {
            
            this.currentUser = user;

            //Redirect if user not logged or deleted
            if (!user || user.isBanned) this.router.navigateByUrl("login/banned", { replaceUrl: true });

            //Get number of reports and autoban user if >= 10
            await this.reportsService.getReports(user.uid).subscribe(

              async reports => {
                
                //Ban if reports are at least from 3 different people
                let reportersUids: string[] = [];

                reports.forEach(report => {

                  //If the reporter is not in the list add it
                  if (!reportersUids.includes(report.reporterId)) reportersUids.push(report.reporterId);
                  
                });

                console.log(reportersUids.length);

                if (reportersUids.length >= 3) {

                  this.userService.banUser(user.uid);
                  this.router.navigateByUrl("login/banned", { replaceUrl: true });
                }
              }
            )
          }
        )
      }
    );
  }


  //Send message
  async sendMessage() {

    await this.getUser();

    //If the User exists
    if (this.currentUser) {

      console.log("User exists")

      //If User is not banned create and send message
      if (!this.currentUser.isBanned) {

        console.log("User can send messages")

        //Get UTC time value
        let utcTime = Moment.utc().valueOf();

        let tempMessage: Message = {

          userId: this.currentUser.uid,
          content: this.messageText,
          isDeleted: false,
          time: utcTime,
        }

        //Add optional image if it's in the holder
        if (this.imageUrlHolder) tempMessage.image = this.imageUrlHolder;

        //Try sending the message
        try {

          //Filter the message
          let customFilter = new Filter({ placeHolder: '🐤'});
          tempMessage.content = customFilter.clean(tempMessage.content);

          //Add message id
          tempMessage.id = tempMessage.time + tempMessage.userId;

          //Add to the message list
          this.allMessages.push(tempMessage);

          //Add to Fire Store
          this.messagesService.addMessage(this.pool.name, tempMessage);

          //Remove ImageHolder
          this.imageUrlHolder = "";

          //Play pop sound
          this.soundService.playRandomPop();

          //Clear message text
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


  //Go to my pools tab (tab 3)
  goToMyPools() {
    this.router.navigateByUrl("/tabs/tab3");
  }


  //Take or load picture
  async takePicture() {

    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: true,
      source: CameraSource.Prompt,
      resultType: CameraResultType.Base64
    });

    let imageBase = image.base64String;
    console.log(imageBase)

    const isAvatar: boolean = false;

    //Upload the image
    this.imagesService.uploadImage(isAvatar, imageBase, this.currentUser.uid).then(

      data => {

        console.log(data.state)

        //Get the url
        data.ref.getDownloadURL().then(

          url => {

            //Save the url in the imageHolder
            this.imageUrlHolder = url;
          }

        ).catch(error => this.showErrorAlert(error));

      }

    ).catch(error => this.showErrorAlert(error));
  }


  //Show an alert with the upload image error
  async showErrorAlert(error) {

    console.log(error);

    //Create alert
    const alert = await this.alert.create({
      header: 'There was an error',
      message: error,
      buttons: [
        {
          text: "Okey",
          handler: () => {}
        }
      ]
    });

    await alert.present();
  }


  //Remove picture from imageHolder and FireStore Storage (to save space)
  async removePicture() {

    await this.imagesService.deleteImage(this.imageUrlHolder).subscribe(

      () => this.imageUrlHolder = ""
    );
  }


  //Remove picture only from imageHolder
  clearHolder() {
    this.imageUrlHolder = "";
  }


  //Show an alert with report options
  async showReportAlert(message: Message) {

    //Create alert
    const alert = await this.alert.create({
      header: 'Report the message',
      message: 'You are going to report a message from the user ' + message.localChatNick + '.',
      inputs: [
        {
          name: 'reason',
          id: 'reason',
          type: 'textarea',
          placeholder: 'Describe the reason...'
        },
      ],
      buttons: [
        {
          text: "Cancel",
          handler: (alertData) => {

            //Clear the reason
            alertData.reason = "";

          }
        },
        {
          text: "Submit",
          handler: (alertData) => {

            //Get UTC time value
            let utcTime = Moment.utc().valueOf();

            let tempReport: Report = {
              reportId: utcTime + message.id,
              messageId: message.id,
              reporterId: this.currentUser.uid,
              reportedUserId: message.userId,
              reason: alertData.reason,
              time: utcTime
            }

            //Add the report to the reports folder
            this.reportsService.addReport(tempReport).then(

              //If success show toast
              () => this.showReportToast()

            //If failed show toast with error
            ).catch(() => this.showReportToast(true));

          }
        }
      ]
    });

    await alert.present();
  }


  //Show report status Toast
  async showReportToast(failed?: boolean) {

    let toast = await this.toast.create({
      message: 'The report is sent.',
      duration: 2000
    });

    //If fails change text
    if (failed) {
      toast.message = "There was an error sending the report, try later."
      toast.duration = 4000
    }

    toast.present();
  }

}
