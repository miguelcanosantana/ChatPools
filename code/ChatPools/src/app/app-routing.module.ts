import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';


//Guard redirect route
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["login"]);


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/redirect/redirect.module').then(m => m.RedirectPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'login/:state',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'redirect',
    loadChildren: () => import('./pages/redirect/redirect.module').then( m => m.RedirectPageModule)
  },
  {
    path: 'group/:chat',
    loadChildren: () => import('./pages/group/group.module').then( m => m.GroupPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'description/:chat',
    loadChildren: () => import('./pages/description/description.module').then( m => m.DescriptionPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin}
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
