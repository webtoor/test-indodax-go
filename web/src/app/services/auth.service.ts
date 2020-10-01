import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/* let apiUrl = "http://localhost:8000/api/"; */  
let apiUrl = "https://api.vuenic.com/api/";  

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http:HttpClient) { }

  PostSignUp(data, type): Observable<any> {
    return this.http.post<any>(apiUrl+type, data)
    .pipe(
      tap(_ => this.log('signUp')),
      catchError(this.handleError('signUp', []))
    );
  }

  PostSignIn(data, type): Observable<any> {
    return this.http.post<any>(apiUrl+type, data)
    .pipe(
      tap(_ => this.log('signIn')),
      catchError(this.handleError('signIn', []))
    );
  }

  GetRequest(type): Observable<any> {
    return this.http.get<any>(apiUrl+type)
    .pipe(
      tap(_ => this.log('get-http-request')),
      catchError(this.handleError('get-http-request', []))
    );
  }

  PostRequest(data, type): Observable<any> {
    return this.http.post<any>(apiUrl+type, data)
    .pipe(
      tap(_ => this.log('post-http-request')),
      catchError(this.handleError('post-http-request', []))
    );
  }


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }

  isAuthenticated(){
    return localStorage.getItem('indodax-go');
  }
}
