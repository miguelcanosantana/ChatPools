import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})


export class SoundService {


  //List of sounds

  //Pop sounds
  popList: string[] = [];
  previousPop: number;


  constructor() {

    //Load sounds into lists

    //Pop sounds
    this.popList.push("../../assets/sounds/pops/pop1.ogg");
    this.popList.push("../../assets/sounds/pops/pop2.ogg");
    this.popList.push("../../assets/sounds/pops/pop3.ogg");
  }


  //Play a random pop sound when sending a message
  playRandomPop() {

    let random;

    do random = Math.floor(Math.random() * this.popList.length);
    while (random == this.previousPop);

    this.previousPop = random;
    console.log("Playing sound: " + (random + 1));
    
    let sound = new Audio(this.popList[random]);
    sound.load();
    sound.play();
  }

}
