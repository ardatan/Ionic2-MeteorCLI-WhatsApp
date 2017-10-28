import { Component, AfterContentInit } from '@angular/core';
import { Alert, AlertController, NavController } from 'ionic-angular';
import { PhoneService } from '../../services/phone';
import { VerificationPage } from '../verification/verification';

@Component({
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginPage implements AfterContentInit {
  phone = '';

  constructor(
    private alertCtrl: AlertController,
    private phoneService: PhoneService,
    private navCtrl: NavController
  ) {}

  async ngAfterContentInit() {
    const phone = await this.phoneService.getNumber();
    if (phone) {
      this.login(phone);
    }
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.login();
    }
  }

  login(phone: string = this.phone): void {
    const alert = this.alertCtrl.create({
      title: 'Confirm',
      message: `Would you like to proceed with the phone number ${phone}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.handleLogin(alert);
            return false;
          }
        }
      ]
    });

    alert.present();
  }

  async handleLogin(alert: Alert): Promise<void> {
    try{
      await alert.dismiss();
      await this.phoneService.verify(this.phone);
      this.navCtrl.push(VerificationPage, {
        phone: this.phone
      });
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
