import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MypoolsPageRoutingModule } from './mypools-routing.module';

import { MypoolsPage } from './mypools.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MypoolsPageRoutingModule
  ],
  declarations: [MypoolsPage]
})
export class MypoolsPageModule {}
