import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CheckTokenService {
  constructor(private router: Router) {}

  isAuthenticateUser(): boolean {
    if (localStorage.getItem("token") || localStorage.getItem("session-started")) return true;
    else this.router.navigate(["/"]);
    return false;
  }
}
