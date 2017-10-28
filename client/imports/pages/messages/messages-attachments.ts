import { Component } from '@angular/core';
import { AlertController, Platform, ModalController, ViewController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { PictureService } from '../../services/picture';
import { MessageType } from '../../../../imports/models';
import { NewLocationMessageComponent } from './location-message';

@Component({
  templateUrl: './messages-attachments.html',
  styleUrls: ['./messages-attachments.scss']
})
export class MessagesAttachmentsComponent {
  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
    private viewCtrl: ViewController,
    private modelCtrl: ModalController,
    private pictureService: PictureService,
    private camera: Camera
  ) {}

  async sendPicture(): Promise<void> {
    const file = await this.pictureService.select();
    this.viewCtrl.dismiss({
      messageType: MessageType.PICTURE,
      selectedPicture: file
    });
  }

  async takePicture(): Promise<void> {
    if (!this.platform.is('cordova')) {
      return console.warn('Device must run cordova in order to take pictures');
    }

    const dataURI = await this.camera.getPicture()
    const blob = this.pictureService.convertDataURIToBlob(dataURI);

    this.viewCtrl.dismiss({
      messageType: MessageType.PICTURE,
      selectedPicture: blob
    });
  }

  sendLocation(): void {
    const locationModal = this.modelCtrl.create(NewLocationMessageComponent);
    locationModal.onDidDismiss((location) => {
      if (!location) {
        this.viewCtrl.dismiss();

        return;
      }

      this.viewCtrl.dismiss({
        messageType: MessageType.LOCATION,
        selectedLocation: location
      });
    });

    locationModal.present();
  }
}
