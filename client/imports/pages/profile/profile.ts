import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Pictures } from '../../../../imports/collections';
import { Profile } from '../../../../imports/models';
import { PictureService } from '../../services/picture';
import { ChatsPage } from '../chats/chats';

@Component({
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfilePage implements OnInit {
  picture: string;
  profile: Profile;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private pictureService: PictureService
  ) {}

  ngOnInit(): void {
    this.profile = Meteor.user().profile || {
      name: ''
    };

    MeteorObservable.subscribe('user').subscribe(() => {
      this.picture = Pictures.getPictureUrl(this.profile.pictureId);
    });
  }

  async selectProfilePicture(): Promise<void> {
    try{
      const blob = await this.pictureService.select();
      this.uploadProfilePicture(blob);
    }catch(e){
      this.handleError(e);
    }
  }

  async uploadProfilePicture(blob: Blob): Promise<void> {
    try{
      const picture = await this.pictureService.upload(blob);
      this.profile.pictureId = picture._id;
      this.picture = picture.url;
    }catch(e){
      this.handleError(e);
    }
  }

  updateProfile(): void {
    MeteorObservable.call('updateProfile', this.profile).subscribe({
      next: () => {
        this.navCtrl.push(ChatsPage);
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });
  }

  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }
}
