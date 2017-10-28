import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, ViewController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { ChatsPage } from '../chats/chats';

@Component({
  templateUrl: './messages-options.html',
  styleUrls: ['./messages-options.scss']
})
export class MessagesOptionsComponent {
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {}

  async remove(): Promise<void> {
    const alert = this.alertCtrl.create({
      title: 'Remove',
      message: 'Are you sure you would like to proceed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.handleRemove(alert);
            return false;
          }
        }
      ]
    });

    await this.viewCtrl.dismiss()
    alert.present();
  }

  handleRemove(alert): void {
    MeteorObservable.call('removeChat', this.params.get('chat')._id).subscribe({
      next: async () => {
        await alert.dismiss()
        this.navCtrl.setRoot(ChatsPage, {}, {
          animate: true
        });
      },
      error: async (e: Error) => {
        await alert.dismiss()
        if (e) {
          return this.handleError(e);
        }

        this.navCtrl.setRoot(ChatsPage, {}, {
          animate: true
        });
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
