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
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: "root",
})
export class InterceptorService1 implements HttpInterceptor {
  token: any = "";

  username = "ILMSAPIUSER";
  password = "ILMSAPIUSER$123";
  authorizationData = "Basic " + btoa(this.username + ":" + this.password);

  constructor(private translocoService: TranslocoService, private _snackBar: MatSnackBar, private router: Router) { }

  clearLogin() {
    localStorage.clear();
    this._snackBar.open("Please login again", "Close", {
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: "warning-toast1",
      duration: 3 * 1000,
    });
    this.router.navigate(['']);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.token == null || this.token == "") {
      this.token = "";
    } else {
      this.token = localStorage.getItem("token");
    }

    const expiresIn = localStorage.getItem("expiresIn");
      const currentTime = new Date().getTime();
      console.log(expiresIn, (+expiresIn - currentTime), (+expiresIn - currentTime) > 1000 * 60 * 60 * 10);//1000 * 60 * 60 * 10
      if(req.url.indexOf("/open/login") < 0) {
        if(expiresIn && (+expiresIn - currentTime) > 1000 * 60 * 60 * 10) {// 1000 * 60 * 60 * 10
          //TODO later use refresh token at this point to set new access token
        }
        else {
          if(expiresIn) {
            if((+expiresIn - currentTime) <= 0) {
              console.log('clearLogin 1');
              this.clearLogin();
            }
          }
        }
      }
    // req = req.clone({
    //   setHeaders: {
    //     // username: "ILMSUSER",
    //     // password: "ILMS@1234",
    //     // // auth_matcher_url: "http://localhost:38080/api/**"
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + this.token,
    //   },
    // });
    // req = req.clone({
    //   headers: req.headers
    //     .append(
    //       "Authorization",
    //       localStorage.getItem("token") != null && localStorage.getItem("token") != "null"
    //         ? "Bearer " + localStorage.getItem("token")
    //         : ""
    //     )
    //     .append("Accept-Language", this.translocoService.getActiveLang())
    //     .append("isRefreshToken", "true"),
    // });
    // req = req.clone({
    //   headers: req.headers
    //     .append("Content-Type", "application/json")
    //     .append("Accept", "application/json")
    //     .append("Authorization", "Bearer " + this.token),
    // });

let credReq = req.clone({
      withCredentials: true
    });

    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      console.log(req.method);
      let xsrfToken: string | null = null;
      if (req.url.includes('bookmyhomeregistration.mhada.gov.in') || req.url.includes('demoilmsservice.mhada.gov.in') || req.url.includes('bookmyhomeregistrationlocal.mhada.gov.in:38089')) {
        xsrfToken = this.getCookie('XSRF-TOKEN1');
        console.log('XSRF-TOKEN1', xsrfToken);
      } else if (req.url.includes('bookmyhomeapplication.mhada.gov.in') || req.url.includes('demoilmsservice1.mhada.gov.in') || req.url.includes('bookmyhomeapplicationlocal.mhada.gov.in:8066')) {
        xsrfToken = this.getCookie('XSRF-TOKEN2');
        console.log('XSRF-TOKEN2', xsrfToken);
      }
      if (xsrfToken) {
        credReq = credReq.clone({
          setHeaders: {
            'X-XSRF-TOKEN': xsrfToken
          }
        });
      }
    }

    return next.handle(credReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please try again later.';
          this.clearLogin();
        } else {
          errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
        }
        console.log('errorMessage --> ',errorMessage);
        console.log('log error --> ',error);
        return throwError(error);
      }));
  }

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
}
