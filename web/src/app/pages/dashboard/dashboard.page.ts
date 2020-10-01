import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  userData;
  transaction;
  user_id;
  refreshPage;
  constructor(public loading: LoaderService, public menu: MenuController, public httpService: AuthService, public route : ActivatedRoute, public router : Router) { 
    this.menu.enable(true);
    const userData = JSON.parse(localStorage.getItem('indodax-go'));
    this.user_id = userData["user_id"]
  }

  ngOnInit() {
    this.getUser();
    this.getTransaction() 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.refreshPage = this.router.getCurrentNavigation().extras.state.refreshPage;
        if(this.refreshPage === 1){
          this.getUser();
          this.getTransaction()      
         }
      }
    });
  }

  ionViewWillLeave(){
    this.refreshPage = 0;
  }

  getUser(){
    this.loading.present();
    this.httpService.GetRequest('user').subscribe(res => {
      console.log(res);
      if(res.status == 200){
        this.userData = res.data
        localStorage.setItem('indodax-go-user', JSON.stringify(res.data));
        this.loading.dismiss();
      }
    });
  }

  getTransaction(){
    this.httpService.GetRequest('transaction').subscribe(res => {
      console.log(res);
      if(res.status == 200){
        this.transaction = res.data
      }
    });
  }

  transferPage(){
    this.router.navigate(['/create-transaction'])
  }
}
