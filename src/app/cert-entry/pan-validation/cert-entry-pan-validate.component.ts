import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/toolbar/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CertEntryService } from '../cert-entry.service';

@Component({
  selector: 'app-cert-entry-pan-validate',
  templateUrl: './cert-entry-pan-validate.component.html',
  styleUrls: ['../../pre-lottery/pre-lottery.component.scss']
})
export class CertEntryPanValidateComponent implements OnInit {
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  form: FormGroup = new FormGroup({});
  captchaResponse: string;
  isSubmitDisabled: boolean = false;
  isCaptchaClicked: boolean = false;
  captchaError: boolean = false;

  constructor(private route: ActivatedRoute, 
    private dialog: MatDialog,
    private certEntryService: CertEntryService,
    private router: Router,
    private translocoService: TranslocoService, private toastController: ToastController,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    
    this.form = new FormGroup({
      pan: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$")]),
    });
  }

  resolved(captchaResponse: string){
    console.log(captchaResponse);
    this.captchaResponse = captchaResponse;
    this.isCaptchaClicked = true;
    this.captchaError = false;
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.displayProgressSpinner();
      if(this.isCaptchaClicked) {
        this.captchaError = false;
        this.certEntryService.loginWithPAN(
          this.form.value.pan,
          this.captchaResponse
        )
        .subscribe((data) => {
          this.progressSpinnerDialog.close();
          if(data.status === 'SUCCESS') {
            if(data.type === 'EMAIL') {
              this.router.navigate(['/cert-entry', 'email-entry', this.form.value.pan.toUpperCase()], { replaceUrl: true });
            }
            else if(data.type === 'DASHBOARD') {
              this.router.navigate(['/cert-entry', 'category-dashboard', this.form.value.pan.toUpperCase()], { replaceUrl: true });
            }
            else {
              this.isSubmitDisabled = false;
              this.certEntryService.showErrorToast(this.translocoService.translate('error-try-again'));
            }
          }
          else {
            this.isSubmitDisabled = false;
            this.certEntryService.showErrorToast(data.errorMessage);
          }
        }, error => {
          console.log('errror', error);
          this.isSubmitDisabled = false;
          this.progressSpinnerDialog.close();
          this.certEntryService.showErrorToast(error?.message||error?.error?.errorMessage);
        });
      }
      else {
        this.progressSpinnerDialog.close();
        this.isSubmitDisabled = false;
        this.captchaError = true;
      }
    }
  }

}
