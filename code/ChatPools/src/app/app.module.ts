import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

@NgModule({

  declarations: [AppComponent],

  entryComponents: [],

  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    IonicStorageModule.forRoot()
  ],

  providers: [
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    AngularFireAuthGuard
],

  bootstrap: [AppComponent],
})
export class AppModule {}
