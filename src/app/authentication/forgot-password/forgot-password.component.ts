import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { LoaderComponent } from "src/app/loader/loader.component";
import { SharedService } from "src/app/toolbar/shared.service";
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  platform = localStorage.getItem("platform");

  signUpPanNo: string = "";
  signUpName: string = "";
  signUpMobileNo: string = "";
  signUpEmailId: string = "";
  signUpPassword: string = "";
  signupConfirmPassword: string = "";
  emailPattern: any = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$";
  passwordPattern: any = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
  mobilePattern: any = "^[0-9]{10}$";
  signUpPanVerified: boolean = true;
  contentVisible: boolean = false;
  emailOtp: string = "";
  mobileOtp: string = "";
  userName: string = "";
  signupPassword: string = "";

  panVerificationResponse: any = "";

  progressSpinnerDialog: any = null;

  timerOn = true;
  resendOtpIn: any = null;
  isResendOtpButtonVisible: boolean = false;
  isOtpVerificationVisible: any = false;
  isEmailVisible: any = false;
  resendOtp: string = "N";

  constructor(
    private dialog: MatDialog,
    public toastController: ToastController,
    private translocoService: TranslocoService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    localStorage.setItem("lastRoute", this.router.url);
  }

  // verifying entered OTP
  async updatePassword() {

// TODO Add Validation

    if(!(this.emailOtp && this.emailOtp.length == 8)){
      return this.backendWarningToast("Please enter valid OTP");
    }
    
    if (this.signupConfirmPassword !== this.signUpPassword) {
      return this.backendWarningToast("Please check the password");
    }

    let str = this.signUpPassword;
    let hash: any = "";
    for (var i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i).toString(16);
    }

    this.displayProgressSpinner();
    this.authenticationService.updatePassword(this.signUpPanNo.toUpperCase(), this.emailOtp, hash).subscribe(data => {
      this.closeProgressSpinner();
      if(data.status == 'SUCCESS') {
        this.successToast("Password changed successfully. Please login with new credentials.");
        this.router.navigate(["/landing"]);
      } else {
        // this.isOtpVerificationVisible = true;
        // this.signUpPanVerified = false;
        this.frontendWarningToast(data.errorMessage);
      }
    }, async error => {
      this.closeProgressSpinner();
      this.backendWarningToast("Unable update password plese try again.");
    });
  }

  // sending OTP to entered mobile number and email id
  async sendOtpOld() {
    this.emailOtp = "";
    this.mobileOtp = "";
    this.displayProgressSpinner();
    const TabRegDto = {
      panNo: this.signUpPanNo.toUpperCase(),
      password: "",
      email: "",
      emailOtp: "",
      reOtpValidity: "",
      mobileNo: "",
      mobileOtp: "",
      status: "",
      panVerificationReponseString: null,
    };
    const response: any = await this.authenticationService.sendForgotPasswordOtp(JSON.stringify(TabRegDto));
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        this.resendOtpTimer(120);
        this.isOtpVerificationVisible = false;
        this.signUpPanVerified = true;
        this.contentVisible = true;
        this.successToast(this.translocoService.translate("success-otp-sent"));
      } else if (response.status.toLowerCase() == "exists") {
        this.frontendWarningToast("This PAN is already registered with MHADA, kindly login.");
      } else if (response.status.toLowerCase() == "failure") {
        this.frontendWarningToast(response.message);
      } else {
        this.backendWarningToast("Unable to send OTP.");
      }
    } else {
      this.errorToast(response);
    }
  }

  async sendOtp() {
    this.displayProgressSpinner();
    this.authenticationService.sendForgotPasswordOtp(this.signUpPanNo.toUpperCase()).subscribe(data => {
      this.closeProgressSpinner();
      if(data.status == 'SUCCESS') {
        this.resendOtpTimer(120);
        this.isOtpVerificationVisible = false;
        this.signUpPanVerified = true;
        this.contentVisible = true;
        this.successToast(this.translocoService.translate("success-otp-sent"));
      } else {
        this.frontendWarningToast(data.errorMessage);
      }
    }, async error => {
      this.closeProgressSpinner();
      this.backendWarningToast("Unable to send OTP.");
    });
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

  // verifying entered OTP
  async verifyOtp() {
    this.displayProgressSpinner();
    const TabRegDto = {
      panNo: this.signUpPanNo.toUpperCase(),
      password: "",
      email: "",
      emailOtp: this.emailOtp,
      reOtpValidity: "",
      mobileNo: "",
      mobileOtp: "",
      status: "",
      panVerificationReponseString: null,
    };
    const response: any = await this.authenticationService.verifyForgotPasswordOtp(JSON.stringify(TabRegDto));
    if (response == "Success") {
      this.successToast("OTP verified.");
      this.signUpPanVerified = false;
      this.contentVisible = false;
      this.isOtpVerificationVisible = true;
    } else {
      this.isOtpVerificationVisible = false;
      this.isEmailVisible = false;
      this.frontendWarningToast(response);
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

  async closeProgressSpinner() {
    this.progressSpinnerDialog.close();
  }
}
