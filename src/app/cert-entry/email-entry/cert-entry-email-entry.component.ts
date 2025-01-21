import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/toolbar/shared.service';
import { CertEntryService } from '../cert-entry.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cert-entry-email-entry',
  templateUrl: './cert-entry-email-entry.component.html',
  styleUrls: ['../../pre-lottery/pre-lottery.component.scss']
})
export class CertEntryEmailEntryComponent implements OnInit {
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  pan: string;
  form: FormGroup = new FormGroup({});
  isSubmitDisabled: boolean = false;

  constructor(private route: ActivatedRoute, 
    private dialog: MatDialog,
    private router: Router,
    private certEntryService: CertEntryService,
    private translocoService: TranslocoService, private toastController: ToastController,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.pan = params['pan'];
      this.loadData();  
    });

    this.form = new FormGroup({
      emailId: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  loadData() {
    this.displayProgressSpinner();
    if(this.pan) {
      this.certEntryService.initEmailForWithPAN(this.pan)
      .subscribe(data => {
        this.progressSpinnerDialog.close();
        if(data.status === 'SUCCESS') {
          this.form.patchValue({
            'emailId': data.emailId
          });
        }
        else {
          this.certEntryService.showErrorToast(data.errorMessage);
        }
      }, error => {
        this.progressSpinnerDialog.close();
        this.certEntryService.showErrorToast(error?.message||error?.error?.errorMessage);
      });
    }
    else {
      this.progressSpinnerDialog.close();
      this.certEntryService.showErrorToast(this.translocoService.translate('error-invalid-pan'));
      this.router.navigate(['/cert-entry', 'pan-validation'], { replaceUrl: true });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.displayProgressSpinner();
      this.certEntryService.submitEmailForPAN(
        this.pan,
        this.form.value.emailId
      )
      .subscribe((data) => {
        this.progressSpinnerDialog.close();
        if(data.status === 'SUCCESS') {
          this.router.navigate(['/cert-entry', 'category-dashboard', this.pan.toUpperCase()], { replaceUrl: true });
        }
        else {
          this.certEntryService.showErrorToast(this.translocoService.translate('error-try-again'));
        }
      }, error => {
        this.isSubmitDisabled = false;
        this.progressSpinnerDialog.close();
        this.certEntryService.showErrorToast(error?.error?.errorMessage);
      });      
    }
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

}
