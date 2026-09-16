import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslocoService } from "@ngneat/transloco";

@Injectable({
  providedIn: "root",
})
export class InterceptorService implements HttpInterceptor {

  token: any = "";

  username = "ILMSAPIUSER";
  password = "ILMSAPIUSER$123";

  authorizationData =
    "Basic " + btoa(this.username + ":" + this.password);

  constructor(
    private translocoService: TranslocoService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Get token from local storage
    if (this.token == null || this.token == "") {
      this.token = "";
    } else {
      this.token = localStorage.getItem("token");
    }

    /*
     * Add common headers
     */
    req = req.clone({
      headers: req.headers
        .append(
          "Accept-Language",
          this.translocoService.getActiveLang()
        )
        .append("isRefreshToken", "true"),
    });

    /*
     * Send cookies along with request
     */
    let credReq = req.clone({
      withCredentials: true
    });

    /*
     * Add XSRF token for non-GET requests
     */
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {

      console.log("HTTP Method:", req.method);

      let xsrfToken: string | null = null;

      /*
       * Registration API
       */
      if (
        req.url.includes(
          "bookmyhomeregistration.mhada.gov.in"
        ) ||
        req.url.includes(
          "securitytestingbookmyhomeregistration.mhada.gov.in"
        ) ||
        req.url.includes(
          "bookmyhomeregistrationlocal.mhada.gov.in:38089"
        )
      ) {

        xsrfToken = this.getCookie("XSRF-TOKEN1");

        console.log(
          "XSRF-TOKEN1:",
          xsrfToken
        );

      }

      /*
       * Application API
       */
      else if (
        req.url.includes(
          "bookmyhomeapplication.mhada.gov.in"
        ) ||
        req.url.includes(
          "securitytestingbookmyhomeapplication.mhada.gov.in"
        ) ||
        req.url.includes(
          "bookmyhomeapplicationlocal.mhada.gov.in:8066"
        )
      ) {

        xsrfToken = this.getCookie("XSRF-TOKEN2");

        console.log(
          "XSRF-TOKEN2:",
          xsrfToken
        );
      }

      /*
       * Add X-XSRF-TOKEN header
       */
      if (xsrfToken) {

        credReq = credReq.clone({
          setHeaders: {
            "X-XSRF-TOKEN": xsrfToken
          }
        });

      }
    }

    /*
     * Send request
     */
    return next.handle(credReq).pipe(

      /*
       * Handle successful response
       */
      map((event: HttpEvent<any>) => {

        if (event instanceof HttpResponse) {
          console.log(
            "event--->>>",
            event
          );
        }

        return event;
      }),

      /*
       * Handle errors
       */
      catchError((error: HttpErrorResponse) => {

        console.log(
          "Interceptor Error Status =",
          error.status
        );

        /*
         * If token/session is unauthorized
         */
        if (error.status === 401) {

          console.log(
            "Redirecting to login..."
          );

          this.clearLogin();
        }

        return throwError(
          () => error
        );
      })
    );
  }

  /*
   * Clear login/session
   */
  clearLogin() {

    localStorage.clear();

    this._snackBar.open(
      "Please login again",
      "Close",
      {
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: "warning-toast1",
        duration: 3 * 1000,
      }
    );

    this.router.navigate([""]);
  }

  /*
   * Get cookie value
   */
  getCookie(
    name: string
  ): string | null {

    const match = document.cookie.match(
      new RegExp(
        "(^|; )" +
        name +
        "=([^;]*)"
      )
    );

    return match
      ? decodeURIComponent(match[2])
      : null;
  }
}