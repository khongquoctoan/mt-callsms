import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { Contacts } from '@ionic-native/contacts';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Camera } from '@ionic-native/camera';

import { SafePipe } from './../pipes/safe.pipe';
import { CurrencyVndPipe } from './../pipes/currency-vnd.pipe';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

@NgModule({
    declarations: [
        MyApp,
        SafePipe,
        CurrencyVndPipe,
        HomePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp)
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
        PhotoLibrary,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
