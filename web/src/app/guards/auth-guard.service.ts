import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate  {

  constructor(private _authService: AuthService, private _router: Router) {
  }

  canActivate(): boolean {
    if (this._authService.isAuthenticated()) {
      //console.log('trueAuth')
        return true;
    }
        //console.log('falseAuth')

       // navigate to login page
       this._router.navigate(['signin']);
       // you can save redirect url so after authing we can move them back to the page they requested
       return false;
  }
}