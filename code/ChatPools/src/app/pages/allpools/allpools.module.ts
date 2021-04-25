import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllpoolsPageRoutingModule } from './allpools-routing.module';

import { AllpoolsPage } from './allpools.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllpoolsPageRoutingModule
  ],
  declarations: [AllpoolsPage]
})
export class AllpoolsPageModule {}
