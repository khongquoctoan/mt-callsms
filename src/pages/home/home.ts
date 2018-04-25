import { FCM } from '@ionic-native/fcm';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Base64 } from '@ionic-native/base64';
import { Camera, CameraOptions } from '@ionic-native/camera';
// import { CallNumber } from '@ionic-native/call-number';
import { Contacts } from '@ionic-native/contacts';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DataService } from '../../services/data.service';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    contactList: any = [];
    allPhotos: any = [];
    cameraResult: any = { 'status': false, 'data': '', 'error': '' };
    photoError: any = '';
    fcmToken: any = '';
    constructor(public navCtrl: NavController,
        // private _callNumber: CallNumber,
        private _dataService: DataService,
        private _socketService : SocketService,
        private _localNotifications: LocalNotifications,
        private _contacts: Contacts,
        private _camera: Camera,
        private _fcm: FCM,
        private _photoLibrary: PhotoLibrary,
        private _base64: Base64) {

            this._socketService.connect();
            this._socketService.listEvent('deviceStatus', false).subscribe(data => {
                data = this._socketService.decodeDataFromSocket(data);
                console.log('socketService deviceStatus: ', data);
            });
    }

    ionViewDidLoad() {
        
    }

    openNotify(textNotify = 'Thông báo mới', dataNotify : any = {}) {
        this._localNotifications.schedule({
            text: textNotify,
            data: dataNotify
        });
    }

    getAllPhotos() {
        this._dataService.withLoader('Đợi xíu nhé :)');
        this._photoLibrary.requestAuthorization().then(() => {
            this._photoLibrary.getLibrary().subscribe({
                next: library => {
                    // this._dataService.post('http://maxtot.com/autocall.php', library).subscribe(
                    //     res => console.log(res),
                    //     err => console.log(err)
                    // );
                    this.allPhotos = library;
                    this._dataService.logData(library);
                    // library.forEach(function (libraryItem) {
                    //     console.log(libraryItem.id);          // ID of the photo
                    //     console.log(libraryItem.photoURL);    // Cross-platform access to photo
                    //     console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
                    //     console.log(libraryItem.fileName);
                    //     console.log(libraryItem.width);
                    //     console.log(libraryItem.height);
                    //     console.log(libraryItem.creationDate);
                    //     console.log(libraryItem.latitude);
                    //     console.log(libraryItem.longitude);
                    //     console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
                    // });
                },
                error: err => { this.photoError = err; console.log('Thông báo!', err); },
                complete: () => { this.photoError = 'done getting photos'; console.log('Thông báo!', 'done getting photos'); }
            });
        })
            .catch(err => {
                this.photoError = 'permissions weren\'t granted';
                console.log('Thông báo!', 'permissions weren\'t granted');
            });
    }
    
    convertImageToBase64(filePath){
        this._base64.encodeFile(filePath).then((base64File: string) => {
                console.log(base64File);
                return base64File;
            }, (err) => {
                console.log(err);
                return '';
            }
        );
    }

    getContactList() {
        this._dataService.withLoader('Đợi xíu nhé :)');
        this._contacts.find(
            ['displayName', 'name', 'phoneNumbers', 'emails'],
            { filter: "", multiple: true })
            .then(data => {
                this._dataService.logData({'contactList': data});

                for (var i = 0; i < data.length; i++) {
                    var contact = data[i];
                    var no = contact.name.formatted;
                    var phonenumber = contact.phoneNumbers;
                    if (phonenumber != null) {
                        for (var n = 0; n < phonenumber.length; n++) {
                            var phone = phonenumber[n].value;
                            if (phone != '') {
                                let contactData = {
                                    "displayName": no,
                                    "phoneNumbers": phone,
                                    "emails": contact.emails ? contact.emails[0].value : '-'
                                }
                                this.contactList.push(contactData);
                            }
                        }
                    }
                }

            },
            (error: any) => {

                console.log('Get list contact!', error)
            });
    }

    // callNumber(phone) {
    //     this._callNumber.callNumber(phone, true)
    //         .then(res => console.log('Launched dialer!', res))
    //         .catch(err => console.log('Error launching dialer', err));
    // }


    openCamrera() {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this._camera.DestinationType.DATA_URL,
            encodingType: this._camera.EncodingType.JPEG,
            mediaType: this._camera.MediaType.PICTURE
        }
        this._camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            this.cameraResult.status = true;
            this.cameraResult.data = 'data:image/jpeg;base64,' + imageData;
            this._dataService.logData(this.cameraResult);
        }, (err) => {
            this.cameraResult.status = false;
            this.cameraResult.error = 'ERROR: ' + err;
            // Handle error
        });
    }

    demoFCM() {
        this._fcm.subscribeToTopic('marketing');

        this._fcm.getToken().then(token => {
            // this.openNotify("Token: "+ token);
            this.fcmToken = token;
            this._dataService.logData('FCM Token: '+token);
            // backend.registerToken(token);
            console.log('token: ', token);
        });

        this._fcm.onNotification().subscribe(data => {
            this._dataService.logData({'fcmOnNotify':data});
            if (data.wasTapped) {
                this._dataService.showToast('FCM: Received in background');
            } else {
                this._dataService.showToast('FCM: Received in foreground');
            };
            this.openNotify(data.content);
        });

        // this._fcm.onTokenRefresh().subscribe(token => {
        //     backend.registerToken(token);
        // });

        // this._fcm.unsubscribeFromTopic('marketing');
    }

    sendNotification() {
        // let body = {
        //     "notification": {
        //         "title": "New Notification has arrived",
        //         "body": "Notification Body",
        //         "sound": "default",
        //         "click_action": "FCM_PLUGIN_ACTIVITY",
        //         "icon": "fcm_push_icon"
        //     },
        //     "data": {
        //         "param1": "value1",
        //         "param2": "value2"
        //     },
        //     "to": "/topics/all",
        //     "priority": "high",
        //     "restricted_package_name": ""
        // }
        // let options = new HttpHeaders().set('Content-Type', 'application/json');
        // this.http.post("https://fcm.googleapis.com/fcm/send", body, {
        //     headers: options.set('Authorization', 'key=YourAuthToken'),
        // })
        //     .subscribe();
    }
}
