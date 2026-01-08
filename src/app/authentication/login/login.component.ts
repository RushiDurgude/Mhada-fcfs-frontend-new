import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { LoaderComponent } from "src/app/loader/loader.component";
import { SharedService } from "src/app/toolbar/shared.service";
import { AuthenticationService } from "../authentication.service";
import { ThemeService } from "src/app/theme.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  platform = localStorage.getItem("platform");
  selectedLoginOption: string = "pwd";
  loginPanNo: string = "";
  loginPassword: string = "";
  loginOtp: string = "";
  progressSpinnerDialog: any = null;

  timerOn = true;
  resendOtpIn: any = null;
  isResendOtpButtonVisible: boolean = false;
  isOtpVerificationVisible: any = false;
  isEmailVisible: any = false;
  resendOtp: string = "N";

  isDarkMode: boolean = false;

  constructor(
    private dialog: MatDialog,
    public toastController: ToastController,
    private translocoService: TranslocoService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private sharedService: SharedService,
    private themeService : ThemeService
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
    // console.log('this LoginComponent',this.isDarkMode);

  }

  ngOnInit() {
    if (localStorage.getItem("loginPan") != null) {
      this.loginPanNo = localStorage.getItem("loginPan");
    }
    localStorage.setItem("lastRoute", this.router.url);
  }

  radioButtonClicked() {}

  async loginUsingPasswordOld() {
    this.displayProgressSpinner();
    let str = this.loginPassword;
    let hash: any = "";
    for (var i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i).toString(16);
    }
    const TabRegDto = {
      panNo: this.loginPanNo.toUpperCase(),
      password: hash,
      email: "",
      emailOtp: "",
      reOtpValidity: "",
      mobileNo: "",
      mobileOtp: "",
      status: "",
      panVerificationReponseString: null,
      message: "",
      loginType: "password",
    };
    const response: any = await this.authenticationService.loginUsingPasswordOld(JSON.stringify(TabRegDto));
    this.progressSpinnerDialog.close();
    if (!response.error) {
      if (response.status.toLowerCase() == "active") {
        localStorage.setItem("panNo", this.loginPanNo);
        localStorage.setItem("callDigi", "true");
        localStorage.setItem("userExists", "true");
        // localStorage.setItem("token", response.message);
        localStorage.setItem("session-started", "true");
        localStorage.setItem("regId", "0");
        // localStorage.setItem("userAlreadyRegistered", "true");
        this.sharedService.setAuthentication(true);
        this.router.navigate(["/registration-step"]);
      } else if (response.status == "Inprocess") {
        localStorage.setItem("panNo", this.loginPanNo);
        localStorage.setItem("session-started", "true");
        localStorage.setItem("regId", "0");
        // localStorage.setItem("token", response.message);
        this.sharedService.setAuthentication(true);
        this.router.navigate(["/registration-step"]);
      } else if (response.status == "Wrong Password") {
        this.frontendWarningToast(response.status);
      } else if (response.status == "User not found.") {
        this.frontendWarningToast(response.status);
        localStorage.setItem("loginPan", this.loginPanNo);
        localStorage.removeItem("otpVerificationPending");
        this.router.navigate(["/signUp"], { replaceUrl: true });
      } else {
        this.frontendWarningToast(response.status);
      }
    } else {
      localStorage.removeItem("otpVerificationPending");
      this.errorToast(response);
    }
  }

  // sending OTP to entered mobile number and email id
  async sendOtpOld() {
    this.loginOtp = "";
    this.displayProgressSpinner();
    const TabRegDto = {
      panNo: this.loginPanNo.toUpperCase(),
      password: "",
      email: "",
      emailOtp: "",
      reOtpValidity: "",
      mobileNo: "",
      mobileOtp: "",
      status: "",
      panVerificationReponseString: null,
      message: "",
      loginType: "otp",
    };
    const response: any = await this.authenticationService.sendLoginOtp(JSON.stringify(TabRegDto));
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        this.resendOtpTimer(120);
        this.isOtpVerificationVisible = true;
        this.isEmailVisible = false;
        this.successToast(this.translocoService.translate("success-otp-sent"));
      } else if (response.status.toLowerCase() == "failure") {
        localStorage.removeItem("otpVerificationPending");
        this.frontendWarningToast(response.message);
      } else {
        this.frontendWarningToast(response.message);
        localStorage.setItem("loginPan", this.loginPanNo);
        localStorage.removeItem("otpVerificationPending");
        this.router.navigate(["/signUp"], { replaceUrl: true });
      }
    } else {
      localStorage.removeItem("otpVerificationPending");
      this.errorToast(response);
    }
  }

  // verifying entered OTP
  async verifyOtpOld() {
    this.displayProgressSpinner();
    const TabRegDto = {
      panNo: this.loginPanNo.toUpperCase(),
      password: "",
      email: "",
      emailOtp: this.loginOtp,
      reOtpValidity: "",
      mobileNo: "",
      mobileOtp: this.loginOtp,
      status: "",
      panVerificationReponseString: null,
      message: "",
      loginType: "otp",
    };
    const response: any = await this.authenticationService.loginUsingPasswordOld(JSON.stringify(TabRegDto));
    this.progressSpinnerDialog.close();
    if (response.status == "Active") {
      // localStorage.setItem("token", response.message);
      localStorage.setItem("panNo", this.loginPanNo);
      localStorage.setItem("callDigi", "true");
      localStorage.setItem("userExists", "true");
      localStorage.setItem("session-started", "true");
      localStorage.setItem("regId", "0");
      // localStorage.setItem("userAlreadyRegistered", "true");
      this.sharedService.setAuthentication(true);
      this.router.navigate(["/registration-step"]);
    } else if (response.status == "Inprocess") {
      // localStorage.setItem("token", response.message);
      localStorage.setItem("panNo", this.loginPanNo);
      localStorage.setItem("session-started", "true");
      localStorage.setItem("regId", "0");
      this.sharedService.setAuthentication(true);
      this.router.navigate(["/registration-step"]);
    } else if (response.status.toLowerCase().includes("otp")) {
      this.frontendWarningToast(response.status);
    } else if (response.status == "User not found.") {
      this.frontendWarningToast(response.status);
      localStorage.setItem("loginPan", this.loginPanNo);
      this.router.navigate(["/signUp"], { replaceUrl: true });
    } else {
      this.isOtpVerificationVisible = true;
      this.isEmailVisible = false;
      this.frontendWarningToast(response.status);
    }
  }

  // RESEND OTP TIMER
  resendOtpTimer(remaining: any) {
    var m: any = Math.floor(remaining / 60);
    var s: any = remaining % 60;

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    this.resendOtpIn = m + ":" + s;
    localStorage.setItem("otpResendTimeLeft", this.resendOtpIn);
    remaining -= 1;

    if (remaining >= 0 && this.timerOn) {
      setTimeout(() => {
        this.resendOtpTimer(remaining);
      }, 1000);
      return;
    }

    if (!this.timerOn) {
      // Do validate stuff here
      return;
    } else {
      // Do timeout stuff here
      // alert('Timeout for otp');
      this.isResendOtpButtonVisible = true;
    }
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  // TOAST MESSAGES
  async successToast(message: string) {
    this.progressSpinnerDialog.close();
    const toast = await this.toastController.create({
      message: message,
      icon: "checkmark-circle-outline",
      position: "top",
      cssClass: "toast success-toast",
      duration: 5000,
    });
    toast.present();
  }

  async frontendWarningToast(message: string) {
    this.progressSpinnerDialog.close();
    const toast = await this.toastController.create({
      message: message,
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 5000,
    });
    toast.present();
  }

  async backendWarningToast(message: any) {
    this.progressSpinnerDialog.close();
    const toast = await this.toastController.create({
      message: message.error,
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 5000,
    });
    toast.present();
  }

  async errorToast(error: any) {
    this.progressSpinnerDialog.close();
    this.progressSpinnerDialog.close();
    const toast = await this.toastController.create({
      message: this.translocoService.translate("error-network-related"),
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 5000,
    });
    toast.present();
  }

  onResendOtpClick() {
    this.resendOtp = "Y";
    this.isResendOtpButtonVisible = false;
    this.sendOtp();
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  // NEW CODE

  async closeProgressSpinner() {
    this.progressSpinnerDialog.close();
  }

  async loginUsingPassword() {
    this.displayProgressSpinner();
    let str = this.loginPassword;
    let hash: any = "";
    for (var i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i).toString(16);
    }

    this.authenticationService
      .loginUsingPassword(this.loginPanNo.toUpperCase(), hash, null, "password")
      .subscribe(data => {
        console.log(data);
        this.closeProgressSpinner();
        if(data.status == 'SUCCESS') {
          localStorage.setItem("panNo", this.loginPanNo);
          // localStorage.setItem("token", data.token);
          localStorage.setItem("expiresIn", data.expiresIn);
          localStorage.setItem("session-started", "true");
          this.sharedService.setAuthentication(true);

          if(data.isOtpVerified == 'Y') {
            if(data.stage == 'PROFILE') {
              this.router.navigate(["/profile"], { replaceUrl: true });
            } else {
              this.router.navigate(["/registration-step"], { replaceUrl: true });
            }
          } else {
            // this.frontendWarningToast(data.errorMessage);
            // localStorage.setItem("loginPan", this.loginPanNo);
            // localStorage.setItem("isOtpVerified", 'N');
            // localStorage.setItem("otpVerificationPending", "true");
            // this.router.navigate(["/signUp"], { replaceUrl: true });

            localStorage.setItem("editQuestionCode", "Q_EMAIL_MOBILE");
            this.router.navigate(["/registration-step"], { replaceUrl: true });
          }
        } else {
          if(data?.errorMessage == "User not found"){
            this.frontendWarningToast(data.errorMessage);
            localStorage.setItem("loginPan", this.loginPanNo);
            localStorage.removeItem("otpVerificationPending");
            this.router.navigate(["/signUp"], { replaceUrl: true });
          } else {
            this.frontendWarningToast(data.errorMessage);
          }
        }

      }, async error => {
        this.closeProgressSpinner();
        this.errorToast("");
      });
  }

  async sendOtp() {
    this.displayProgressSpinner();
    this.authenticationService.sendLoginOtp(this.loginPanNo.toUpperCase())
      .subscribe(data => {
        this.closeProgressSpinner();
        if (data.status == 'SUCCESS') {
          this.resendOtpTimer(120);
          this.isOtpVerificationVisible = true;
          this.isEmailVisible = false;
          this.successToast(this.translocoService.translate("success-otp-sent"));
        } else {
          if (data?.errorMessage == "User not found") {
            this.frontendWarningToast(data.errorMessage);
            localStorage.setItem("loginPan", this.loginPanNo);
            localStorage.removeItem("otpVerificationPending");
            this.router.navigate(["/signUp"], { replaceUrl: true });
          } else {
            localStorage.removeItem("otpVerificationPending");
            this.frontendWarningToast(data.errorMessage);
          }
        }
      }, async error => {
        this.closeProgressSpinner();
        localStorage.removeItem("otpVerificationPending");
        this.errorToast("");
      });
  }

  async verifyOtp() {
    this.displayProgressSpinner();
    
    this.authenticationService
      .loginUsingPassword(this.loginPanNo.toUpperCase(), null,this.loginOtp, "otp")
      .subscribe(data => {
        console.log(data);
        this.closeProgressSpinner();
        if(data.status == 'SUCCESS') {
          localStorage.setItem("panNo", this.loginPanNo);
          // localStorage.setItem("token", data.token);
          localStorage.setItem("expiresIn", data.expiresIn);
          localStorage.setItem("session-started", "true");
          this.sharedService.setAuthentication(true);

          if(data.isOtpVerified == 'Y') {
            if(data.stage == 'PROFILE') {
              this.router.navigate(["/profile"], { replaceUrl: true });
            } else {
              this.router.navigate(["/registration-step"], { replaceUrl: true });
            }
          } else {
            this.frontendWarningToast(data.errorMessage);
            localStorage.setItem("loginPan", this.loginPanNo);
            // localStorage.setItem("isOtpVerified", 'N');
            localStorage.setItem("otpVerificationPending", "true");
            this.router.navigate(["/signUp"], { replaceUrl: true });
          }
        } else {
          if(data?.errorMessage == "User not found"){
            this.frontendWarningToast(data.errorMessage);
            localStorage.setItem("loginPan", this.loginPanNo);
            localStorage.removeItem("otpVerificationPending");
            this.router.navigate(["/signUp"], { replaceUrl: true });
          } else {
            this.frontendWarningToast(data.errorMessage);
          }
        }

      }, async error => {
        this.closeProgressSpinner();
        this.errorToast("");
      });
  }
}
