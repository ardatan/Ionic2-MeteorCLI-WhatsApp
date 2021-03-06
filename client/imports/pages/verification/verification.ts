import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { PhoneService } from '../../services/phone';

@Component({
  templateUrl: './verification.html',
  styleUrls: ['./verification.scss']
})
export class VerificationPage implements OnInit {
  code: string = '';
  phone: string;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private phoneService: PhoneService
  ) {}

  ngOnInit() {
    this.phone = this.navParams.get('phone');
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.verify();
    }
  }

  async verify(): Promise<void> {
    await this.phoneService.login(this.phone, this.code)
    this.navCtrl.setRoot(ProfilePage, {}, {
      animate: true
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
