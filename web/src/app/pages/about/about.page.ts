import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  userData
  constructor(public menu: MenuController) { 
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.userData = JSON.parse(localStorage.getItem('indodax-go'));
    //console.log(this.userData)
    if(this.userData == null){
      this.menu.enable(false);

    }else{
      this.menu.enable(true);
    }
    
  }

}
