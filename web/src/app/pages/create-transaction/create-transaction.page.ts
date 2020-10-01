import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.page.html',
  styleUrls: ['./create-transaction.page.scss'],
})
export class CreateTransactionPage implements OnInit {
  transactionForm: FormGroup;
  userData;
  submitted = false;
  constructor(public loading: LoaderService,  public route : ActivatedRoute, public toastController: ToastController, private formBuilder: FormBuilder, public router : Router, public authService : AuthService) { 
    const userData = JSON.parse(localStorage.getItem('indodax-go-user'));
    this.userData = userData;
  }
  ngOnInit() {
    this.transactionForm = this.formBuilder.group({
      'receiver' : [null, [Validators.required]],
      'amount' : [null, [Validators.required]],
    }); 
  }

  get f() { return this.transactionForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.transactionForm.invalid) {
        return;
    }
    console.log(this.transactionForm.value)
    this.loading.present();
    this.authService.PostRequest(this.transactionForm.value, 'transaction').subscribe(res => {
      console.log(res)
      if(res.status === 201) {
        let navigationExtras: NavigationExtras = {
          replaceUrl: true,
          state: {
            refreshPage : 1
          }
        };
        this.loading.dismiss();
        this.router.navigate(['/dashboard'], navigationExtras);    
        }else if(res.error){
          this.loading.dismiss();
          this.presentToast(res.error, "bottom", 5000);
      }
    });
  }

  async presentToast(msg, position, duration) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      position: position
    });
    toast.present();
  }


}
