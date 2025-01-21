
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ProfileService } from 'src/app/profile/profile.service';
import { SharedService } from 'src/app/toolbar/shared.service';
import { ProjectConstants } from '../project-constants';
import { OtpDialogService } from './otp-dialog.service';

@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss'],
})
export class OtpDialogComponent implements OnInit {
  otp: string;
  timeLeft: number = 300;
  interval;
  showOtp: string = "";
  showFirst: boolean = false;
  progressSpinnerDialog: any = null;
  ShowResend: boolean = false
  platform: string = "";
  activeLang: string = "";
  successResendMsg = "OTP resend successfully!!!.."
  validatyExpireEnMR = "Validity Expired !!!"
  otpInvalidEnMR = "Invalid OTP, Please try again"
  tokenEnMR = "Security Token is expired, please relogin with DigiLocker"
  networkErENMr = "There was network related or instance related error understanding the request. Please try doing it again"
  @ViewChild("ngOtpInput", { static: true }) ngOtpInput: any;
  mobileOtp: any = "";
  constructor(private router: Router,
    private dialogRef: MatDialogRef<OtpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastController: ToastController,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private profileService: ProfileService,
    public otpService: OtpDialogService) { }

  //set value of otp input
  setVal() {
    this.ngOtpInput.setValue('')
  }
  //
  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async validate() {
    this.displayProgressSpinner();
    const response: any = await this.otpService.verifyOtp(this.mobileOtp, this.data.id);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status == ProjectConstants.responseStatusSuccess) {
        this.dialogRef.close(ProjectConstants.dialogCloseYes);
      } else if (response.status == ProjectConstants.otpValidityExpired) {
       this.mobileOtp=""
        this.timeLeft = 0;
        this.showOtp = this.validatyExpireEnMR
      } else if (response.status == ProjectConstants.responseStatusFailure) {
        if (response.message == ProjectConstants.otpInvalidStatus) {
          this.showOtp = this.otpInvalidEnMR
          this.mobileOtp=""
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
    this.checkActiveLanguage()
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
    const response: any = await this.otpService.resendOtp(this.data.id);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status == ProjectConstants.responseStatusSuccess) {
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
    } else {
      this.errorToast(response)
    }
  }
  //

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: false,
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
          localStorage.setItem("token", response.token);
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
          this.router.navigate(['my-grievances'])
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
        this.router.navigate(['my-grievances'])
      }, 2000);
    }
  }
  //

  checkActiveLanguage() {
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
      if (this.activeLang == "en") {
        this.successResendMsg = "OTP resend successfully!!!.."
        this.validatyExpireEnMR = "Validity Expired !!!"
        this.otpInvalidEnMR = "Invalid OTP, Please try again"
        this.tokenEnMR = "Security Token is expired, please relogin with DigiLocker";
        this.networkErENMr = "There was network related or instance related error understanding the request. Please try doing it again";
      } else {
        this.successResendMsg = "ओटीपी यशस्वीरित्या पुन्हा पाठवला"
        this.validatyExpireEnMR = "वैधता कालबाह्य !!!"
        this.otpInvalidEnMR = "अवैध OTP, कृपया पुन्हा प्रयत्न करा"
        this.tokenEnMR = "सुरक्षा टोकन कालबाह्य झाले आहे, कृपया DigiLocker सह पुन्हा लॉगिन करा";
        this.networkErENMr = "विनंती समजून घेण्यात नेटवर्कशी संबंधित किंवा उदाहरण संबंधित त्रुटी आली. कृपया ते पुन्हा करण्याचा प्रयत्न करा.";
      }
    });
  }

}
