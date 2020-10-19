import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signUpForm: FormGroup;
  submitted = false;
  showPassword = false;
  passwordToggleIcon = "eye";
  constructor(private formBuilder: FormBuilder, public menu: MenuController, public router : Router, public authService : AuthService, public toastController: ToastController) {
    this.menu.enable(false);
  }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      'username' : [null, Validators.required],
      'email' : [null, [Validators.required, Validators.email]],
      'password' : [null, Validators.required],
      'password_confirmation' : [null],
    });
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
    if (this.signUpForm.invalid) {
        return;
    }
    this.signUpForm.patchValue({
      password_confirmation :this.signUpForm.value.password
    })
    
    console.log(this.signUpForm.value)
   
    this.authService.PostSignUp(this.signUpForm.value, 'signup').subscribe(res => {
      console.log(res)
      if(res.status == 201) {
        this.submitted = false;
        this.signUpForm.reset()
        let navigationExtras: NavigationExtras = {
          replaceUrl: true,
          state: {
            registerStatus : 1
          }
        };
        this.router.navigate(['/signin'], navigationExtras);
      }else if(res.error){
          this.presentToast(res.error, "bottom")
      }
    });
  }

  get f() { return this.signUpForm.controls; }

  signinPage(){
    this.router.navigate(['/signin'], {replaceUrl: true})
  }

  aboutPage(){
    this.router.navigate(['/about'])
  }

  async presentToast(msg, position) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
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
