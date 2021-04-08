import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import {HttpModule} from '@angular/http';
import { CacheModule } from 'ionic-cache';
import { IonicStorageModule } from '@ionic/storage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Network } from '@ionic-native/network/ngx';

import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, NgxSpinnerModule, FormsModule, HttpClientModule, ReactiveFormsModule, HttpModule, 
  IonicStorageModule.forRoot(), 
  CacheModule.forRoot({ keyPrefix: 'my-app-cache'}), NgbModule.forRoot()],
  
  providers: [
    StatusBar,
    Geolocation,
    EmailComposer,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
     Network
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
