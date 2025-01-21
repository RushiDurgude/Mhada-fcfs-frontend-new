import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedService } from 'src/app/toolbar/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';

@Component({
  selector: 'app-surrender-remark',
  templateUrl: './surrender-remark.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class SurrenderRemarkComponent implements OnInit {
  lang: string;
  otpSentMessage: string;
  authEncryped: string;
  resendOtpIn: string;
  applicationKey: number;
  isResendOtpButtonVisible: boolean = false;
  form: FormGroup = new FormGroup({});
  constructor(private modalCtrl: ModalController, private sharedService: SharedService, 
    private preLotteryApplicationService: PreLotteryApplicationService) { }

  ngOnInit(): void {
    this.resendOtpTimer(120);
    this.form = new FormGroup({
      remark: new FormControl(null, [Validators.required]),
      enteredOtp: new FormControl(null, [Validators.required])
    });

    this.sharedService.name.subscribe((lang) => {
      this.lang = lang;
    });
  }

  resendOtpTimer(remaining: any) {
    var m: any = Math.floor(remaining / 60);
    var s: any = remaining % 60;

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    this.resendOtpIn = m + ":" + s;
    remaining -= 1;

    if (remaining > 0) {
      setTimeout(() => {
        this.resendOtpTimer(remaining);
      }, 1000);
      return;
    }
    else {
      this.isResendOtpButtonVisible = true;
    }
  }

  onResendOtpClick() {
    this.preLotteryApplicationService.regenerateOtpForSurrender(this.applicationKey, this.authEncryped).subscribe(async (data) => {
      if(data.status === 'SUCCESS') {
        this.otpSentMessage = data.otpSentMessage;
        this.authEncryped = data.authEncryped;
        this.isResendOtpButtonVisible = false;
        this.resendOtpTimer(300);
      }
      else {
        alert(data.errorMessage);
      }
    }, error => {
      if(error?.errorMessage?.errorMessage.indexOf('Limit') > 0) {
        alert(error?.errorMessage?.errorMessage);
      }
      else {
        alert('Please try again.');
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if(this.form.value.remark.trim().length > 0){
        if(this.form.value.enteredOtp.trim().length === 6){
          return this.modalCtrl.dismiss({
            remark: this.form.value.remark.trim(),
            enteredOtp: this.form.value.enteredOtp.trim(),
            authEncryped: this.authEncryped
          }, 'submit');
        }
        else {
          alert('Please enter valid OTP');
        }
      } else {
        alert('Please enter Remark');
      }
    }
    else {
      if(!this.form.value.remark && !this.form.value.enteredOtp) {
        alert('Please enter Remark and OTP');
      }
      else if(!this.form.value.remark) {
        alert('Please enter Remark');
      }
      else if(!this.form.value.enteredOtp) {
        alert('Please enter OTP');
      }
      else {
        alert('Please enter mandatory details');
      }
    }
  }

  onBlurField() {
    if(!isNaN(+parseInt(this.form.value.enteredOtp))) {
      
    }
    else {
      this.form.patchValue({
        enteredOtp: null
      });
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
