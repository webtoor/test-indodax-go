import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
    Router
} from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
loaderToShow: any;
isLoading = false;

  constructor(private router: Router, public toastController: ToastController, public loadingController: LoadingController) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = JSON.parse(localStorage.getItem('indodax-go'));

    //console.log(token)

    if (token) {
        request = request.clone({
        setHeaders: {
            'Authorization': 'Bearer ' + token['access_token']
        }
        });
    }

    if (!request.headers.has('Content-Type')) {
        request = request.clone({
        setHeaders: {
            'Content-type': 'application/json'
        }
        });
    }

    request = request.clone({
        headers: request.headers.set('Accept', 'application/json')
    });
    //this.showLoader();
    return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
           // console.log('event--->>>', event);
            //this.hideLoader();
        }
        return event;
        }),
        catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
            if (error.error.success === false) {
                this.presentToast('Login failed');
            } else {
                //this.dashboardPage.alive = false;
                localStorage.clear();
                this.router.navigate(['signin', {replaceUrl : true}]);
            }
        }
        if(error.status === 0){
            this.presentToast("Maaf. Sedang dalam Pemeliharaan sistem, silakan coba lagi nanti :(");
        }
        //this.hideLoader();
        return throwError(error);
        }));
    }

    async presentToast(msg) {
    const toast = await this.toastController.create({
        message: msg,
        duration: 2000,
        position: 'bottom'
    });
    toast.present();
    }

    async showLoader() {
        this.isLoading = true;
        return await this.loadingController.create({
          message: 'Processing Server Request',
        }).then(a => {
          a.present().then(() => {
            //console.log('presented');
            if (!this.isLoading) {
              a.dismiss()/* .then(() => console.log('abort presenting')); */
            }
          });
        });
      }
    
      async hideLoader() {
        this.isLoading = false;
        return await this.loadingController.dismiss()/* .then(() => console.log('dismissed')); */
      }
}  