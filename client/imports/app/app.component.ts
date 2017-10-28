import { Component, ViewEncapsulation } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { ChatsPage } from '../pages/chats/chats';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyApp {
  rootPage: any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) {}
  async ngOnInit(){
    MeteorObservable.autorun().subscribe(() => {
      this.rootPage = Meteor.user() ? ChatsPage : LoginPage;
    });
    await this.platform.ready();
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    if (this.platform.is('cordova')) {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }
  }
}
