import { PhotoLibrary } from '@ionic-native/photo-library';
// import { CallNumber } from '@ionic-native/call-number';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    contactList: any = [];
    allPhotos: any = [];
    constructor(public navCtrl: NavController,
        // private _callNumber: CallNumber,
        private _localNotifications: LocalNotifications,
        private _contacts: Contacts,
        private _photoLibrary: PhotoLibrary) {

    }
    ionViewDidLoad() {
        this._localNotifications.schedule({
            id: 1,
            text: 'Single ILocalNotification',
            data: 'test'
        });
    }
    getAllPhotos() {

        this._photoLibrary.requestAuthorization().then(() => {
            this._photoLibrary.getLibrary().subscribe({
                next: library => {
                    // this._dataService.post('http://maxtot.com/autocall.php', library).subscribe(
                    //     res => console.log(res),
                    //     err => console.log(err)
                    // );
                    this.allPhotos = library;
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
                error: err => { console.log('Thông báo!', err); },
                complete: () => { console.log('Thông báo!', 'done getting photos'); }
            });
        })
            .catch(err => {
                console.log('Thông báo!', 'permissions weren\'t granted');
            });
    }

    getContactList() {
        this._contacts.find(
            ['displayName', 'name', 'phoneNumbers', 'emails'],
            { filter: "", multiple: true })
            .then(data => {


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

}
