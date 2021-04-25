import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RedirectPage } from './redirect.page';

const routes: Routes = [
  {
    path: '',
    component: RedirectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RedirectPageRoutingModule {}
