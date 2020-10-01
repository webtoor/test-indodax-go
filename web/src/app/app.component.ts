import { Component, OnInit } from '@angular/core';

import { AlertController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { EventsService } from 'src/app/services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  emailShow :string;
  usernameShow: string;
  public appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'home'
    },
    {
      title: 'Transfer',
      url: '/create-transaction',
      icon: 'paper-plane'
    },  
    {
      title: 'History Transaksi',
      url: '/transaction',
      icon: 'mail'
    },
    {
      title: 'Tentang Apps',
      url: '/about',
      icon: 'information-circle'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public events : EventsService,
    public alertController: AlertController,
    public router : Router,

  ) {
    const token = JSON.parse(localStorage.getItem('indodax-go'));
    if(token){
      this.emailShow = token.email;
      this.usernameShow = token.username;
    }
    this.events.subscribe('email', (email) => {
      this.emailShow = email;
      //console.log(this.emailShow);
    });
    this.events.subscribe('username', (username) => {
      this.usernameShow = username;
      //console.log(this.usernameShow);
    });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    console.log('Golang Backend deploying in https://api.vuenic.com')
  }

  async logout(){
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'Klik OK untuk Logout?',
      buttons: [
        {
          text: 'CANCEL',
          handler: () => {
            
          }
        },
       {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
            localStorage.clear();
            this.router.navigate(['/signin'], {replaceUrl: true})
          }
        }
      ]
    });
    await alert.present();
}
}
