import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../authentication/authentication.service";

@Injectable({
  providedIn: "root",
})
export class CheckTokenService {
  constructor(private router: Router, private authService: AuthenticationService) {}

  // isAuthenticateUser(): boolean {
  //   if (localStorage.getItem("token") || localStorage.getItem("session-started")) return true;
  //   else this.router.navigate(["/"]);
  //   return false;
  // }

  async isAuthenticateUser(): Promise<boolean> {
    const isValid = await this.authService.checkSession();
    if(isValid) {
      return true;
    }
    else {
      this.router.navigate(["/"]);
      return false;
    }
  }
}
