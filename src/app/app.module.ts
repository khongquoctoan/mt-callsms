import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Contacts } from '@ionic-native/contacts';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Camera } from '@ionic-native/camera';
import { FCM } from '@ionic-native/fcm';

import { SafePipe } from './../pipes/safe.pipe';
import { CurrencyVndPipe } from './../pipes/currency-vnd.pipe';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DataService } from '../services/data.service';

@NgModule({
    declarations: [
        MyApp,
        SafePipe,
        CurrencyVndPipe,
        HomePage
    ],
    imports: [
        HttpModule,
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        LocalNotifications,
        Contacts,
        Camera,
        FCM,
        PhotoLibrary,
        DataService,
        Network,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
