import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ProfileService } from 'src/app/profile/profile.service';
import { SharedService } from 'src/app/toolbar/shared.service';
import { ProjectConstants } from '../project-constants';
import { OsOtpDialogService } from './os-otp-dialog.service';

@Component({
  selector: 'app-os-otp-dialog',
  templateUrl: './os-otp-dialog.component.html',
  styleUrls: ['./os-otp-dialog.component.scss'],
})
export class OsOtpDialogComponent implements OnInit {
  otp: string;
  timeLeft: number = 300;
  interval;
  showOtp: string = "";
  showFirst: boolean = false;
  progressSpinnerDialog: any = null;
  ShowResend: boolean = false
  mobileOtp: any = "";
  platform: string = "";
  activeLang: string = "";
  successResendMsg = ProjectConstants.resendOtpSuccessEn
  validatyExpireEnMR = "Validity Expired !!!"
  otpInvalidEnMR = "Invalid OTP, Please try again"
  tokenEnMR = "Security Token is expired, please relogin with DigiLocker"
  networkErENMr = "There was network related or instance related error understanding the request. Please try doing it again"

  constructor(private router: Router,
    private dialogRef: MatDialogRef<OsOtpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastController: ToastController,
    private dialog: MatDialog,
    private profileService: ProfileService,
    private sharedService: SharedService,
    public osotpService: OsOtpDialogService) { }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async validate() {
    this.displayProgressSpinner();
    const response: any = await this.osotpService.verifyOtpObjection(this.mobileOtp, this.data.id);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status == ProjectConstants.responseStatusSuccess) {
        this.dialogRef.close(ProjectConstants.dialogCloseYes);
      } else if (response.status == ProjectConstants.otpValidityExpired) {
        this.mobileOtp = ""
        this.timeLeft = 0;
        this.showOtp = this.validatyExpireEnMR
      } else if (response.status == ProjectConstants.responseStatusFailure) {
        if (response.message == ProjectConstants.otpInvalidStatus) {
          this.showOtp = this.otpInvalidEnMR
          this.mobileOtp = ""
        } else if (response.message == ProjectConstants.grievanceBackendTimeoutMsg) {
          this.exceptionErrorToast()
          this.dialogRef.close(ProjectConstants.noMsg);
        } else if (response.message == ProjectConstants.lotteryBackendTimeoutMsg) {
          this.exceptionErrorToast()
          this.dialogRef.close(ProjectConstants.noMsg);
        }
      }
    } else {
      this.errorToast(response)
    }
  }

  async exceptionErrorToast() {
    this.checkActiveLanguage()
    const toast = await this.toastController.create({
      message: this.networkErENMr,
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 5000,
    });
    toast.present();

  }

  ngOnInit() {
    //set timer for otp 5min=300sec
    // this.interval = setInterval(() => {
    //   if (this.timeLeft > 0) {
    //     this.timeLeft--;
    //   } else {
    //     this.timeLeft = 0;

    //   }
    // }, 1000)
    //
    const countdown$ = timer(0, 1000).pipe(
      take(300),
      map(secondsElapsed =>{ 
        this.timeLeft= 300 - secondsElapsed
      })
         
    );
    countdown$.subscribe(secondsLeft => {     
      var timeLeft  = secondsLeft;
    });
    this.checkActiveLanguage()
  }

  async successToast() {
    const toast = await this.toastController.create({
      message: this.successResendMsg,
      icon: "checkmark-circle-outline",
      position: "top",
      cssClass: "toast success-toast",
      duration: 5000,
    });
    toast.present();
  }

  //resend otp
  async resendOtp() {
    this.displayProgressSpinner();
    this.mobileOtp=""
    this.showOtp=""
    const response: any = await this.osotpService.resendOtpObjection(this.data.id);
    this.progressSpinnerDialog.close();
    if (response.status == ProjectConstants.responseStatusSuccess) {
      this.checkActiveLanguage()
      this.successToast()
      this.ShowResend = false;
      this.timeLeft = 300
      // this.interval = setInterval(() => {
      //   if (this.timeLeft > 0) {
      //     this.timeLeft--;
      //   } else {
      //     this.timeLeft = 0;
      //   }
      // }, 1000)
      const countdown$ = timer(0, 1000).pipe(
        take(300),
        map(secondsElapsed =>{ 
          this.timeLeft= 300 - secondsElapsed
        })
           
      );
      countdown$.subscribe(secondsLeft => {     
        var timeLeft  = secondsLeft;
      });
    } else if (response.status = ProjectConstants.responseStatusFailure) {
      this.exceptionErrorToast()
    }
  }
  //


  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }



  //error toast
  async errorToast(error: any) {
    this.checkActiveLanguage()
    this.platform = localStorage.getItem("platform");
    if (error.error.message != undefined) {
      if (error.error.message.includes("JWT expired")) {
        if (this.platform == "browser" || this.platform == "browser-local") {
          alert(this.tokenEnMR)
          localStorage.clear();
          this.router.navigate(["/"]);
          window.location.reload();
        } else {
          const response: any = await this.profileService.refreshtoken();
          // localStorage.setItem("token", response.token);
          this.ngOnInit();
        }
      } else {
        const toast = await this.toastController.create({
          message: this.networkErENMr,
          icon: "information-circle",
          position: "top",
          cssClass: "toast error-toast",
          duration: 5000,
        });
        toast.present();
        setTimeout(() => {
          this.progressSpinnerDialog.close();
          this.router.navigate(['my-objection-suggestion'])
        }, 2000);
      }
    } else {
      const toast = await this.toastController.create({
        message: this.networkErENMr,
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 5000,
      });
      toast.present();
      setTimeout(() => {
        this.progressSpinnerDialog.close();
        this.router.navigate(['my-objection-suggestion'])
      }, 2000);
    }
  }
  //

  checkActiveLanguage() {
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
      if (this.activeLang == "en") {
        this.successResendMsg =ProjectConstants.resendOtpSuccessEn
        this.validatyExpireEnMR = ProjectConstants.otpValidityExpired
        this.otpInvalidEnMR = ProjectConstants.otpInvalidStatusMsg
        this.tokenEnMR =ProjectConstants.tokenExpireEnMsg;
        this.networkErENMr = ProjectConstants.networkErrorEnMsg;
      } else {
        this.successResendMsg = ProjectConstants.resendOtpSuccessMr
        this.validatyExpireEnMR = ProjectConstants.otpValidityExpiredMr
        this.otpInvalidEnMR = ProjectConstants.otpInvalidStatusMrMsg
        this.tokenEnMR =ProjectConstants.tokenExpireMrMsg;
        this.networkErENMr = ProjectConstants.networkErrorMrMsg;
      }
    });
  }
}
