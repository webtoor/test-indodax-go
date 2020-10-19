import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/event.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  signInForm: FormGroup;
  submitted = false;
  showPassword = false;
  passwordToggleIcon = "eye"; 
  registerStatus = 0;
  constructor(public loading: LoaderService, public events: EventsService, public route : ActivatedRoute, public toastController: ToastController, public menu: MenuController, private formBuilder: FormBuilder, public router : Router, public authService : AuthService) { 
    this.menu.enable(false);
  }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      'username' : [null, [Validators.required]],
      'password' : [null, Validators.required],
    }); 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.registerStatus = this.router.getCurrentNavigation().extras.state.registerStatus;
        if(this.registerStatus === 1){
          this.presentToast('Terima kasih, Anda berhasil daftar, Silakan login', "bottom", 5000);
        }
      }
    });
  }
  ionViewWillLeave(){
    this.registerStatus = 0;
  }

  ionViewWillEnter(){
    this.menu.enable(false);
    const check = JSON.parse(localStorage.getItem('indodax-go'));
    if(check){
      this.router.navigate(["/dashboard"])
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.signInForm.invalid) {
        return;
    }
    console.log(this.signInForm.value)
    this.loading.present();
    this.authService.PostSignIn(this.signInForm.value, 'signin').subscribe(res => {
      console.log(res)
      if(res.access_token) {
        this.submitted = false;
        this.signInForm.reset()
        localStorage.setItem('indodax-go', JSON.stringify(res));
        this.events.publish('email', res.email);
        this.events.publish('username', res.username);
        this.loading.dismiss();
        this.router.navigate(['/dashboard'], {replaceUrl: true});
      }else if(res.status === 400){
        this.loading.dismiss();
        this.presentToast(res.message, "bottom", 3000);
      }
    });
  }

  get f() { return this.signInForm.controls; }

  signupPage(){
    this.router.navigate(['/signup'], {replaceUrl: true})
  }

  aboutPage(){
    this.router.navigate(['/about'])
  }

  async presentToast(msg, position, duration) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      position: position
    });
    toast.present();
  }

  togglePassword(){
    this.showPassword = !this.showPassword
    if(this.passwordToggleIcon == "eye"){
      this.passwordToggleIcon = "eye-off";
    }else{
      this.passwordToggleIcon = "eye";
    }
  }

}
