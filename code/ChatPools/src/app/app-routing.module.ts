import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'redirect',
    loadChildren: () => import('./pages/redirect/redirect.module').then( m => m.RedirectPageModule)
  },
  {
    path: '',
    redirectTo: 'redirect',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'allpools',
    loadChildren: () => import('./pages/allpools/allpools.module').then( m => m.AllpoolsPageModule)
  },
  {
    path: 'groupchat',
    loadChildren: () => import('./pages/groupchat/groupchat.module').then( m => m.GroupchatPageModule)
  },
  {
    path: 'groupchat/:chat',
    loadChildren: () => import('./pages/groupchat/groupchat.module').then( m => m.GroupchatPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
