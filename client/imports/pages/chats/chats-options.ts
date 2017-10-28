import { Component, Injectable } from '@angular/core';
import { Alert, AlertController, NavController, ViewController } from 'ionic-angular';
import { PhoneService } from '../../services/phone';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: './chats-options.html',
  styleUrls: ['./chats-options.scss']
})
@Injectable()
export class ChatsOptionsComponent {
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private phoneService: PhoneService,
    private viewCtrl: ViewController
  ) {}

  async editProfile(): Promise<void> {
    await this.viewCtrl.dismiss();
    this.navCtrl.push(ProfilePage);
  }

  async logout(): Promise<void> {
    const alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you would like to proceed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.handleLogout(alert);
            return false;
          }
        }
      ]
    });

    await this.viewCtrl.dismiss();
    alert.present();
  }

  async handleLogout(alert: Alert): Promise<void> {

    try{
      await alert.dismiss();
      await this.phoneService.logout();
      this.navCtrl.setRoot(LoginPage, {}, {
        animate: true
      })
    }catch(e){
      this.handleError(e);
    }

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
