import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllpoolsPage } from './allpools.page';

const routes: Routes = [
  {
    path: '',
    component: AllpoolsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllpoolsPageRoutingModule {}
