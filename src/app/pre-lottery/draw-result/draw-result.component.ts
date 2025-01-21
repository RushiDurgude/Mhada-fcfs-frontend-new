import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementModel } from '../models/announcment.model';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/toolbar/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationListItemModel } from '../models/application-list-item.model';

@Component({
  selector: 'app-draw-result',
  templateUrl: './draw-result.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class DrawResultComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  formValidMessage: boolean = true;
  formSubmitted: boolean = false;
  isSubmitDisabled: boolean = false;
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  lang: string;
  applicationData: ApplicationListItemModel;

  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService, 
    private sanitizer: DomSanitizer, private dialog: MatDialog, 
    private translocoService: TranslocoService, private toastController: ToastController,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      applicationNo: new FormControl(null, [Validators.required, Validators.minLength(10), 
      Validators.maxLength(10)]),
    });
  }

  reset() {
    this.applicationData = null;
    this.form.reset();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSubmit() {
    if (this.form.valid) {
      this.applicationData = null;
      this.displayProgressSpinner();
      this.preLotteryApplicationService
      .searchDrawResult(
        this.form.value.applicationNo,
      )
      .subscribe((data) => {
        this.progressSpinnerDialog.close();
        if(data.status === 'SUCCESS') {
          this.applicationData = data;
        }
        else {
          this.isSubmitDisabled = false;
          this.preLotteryApplicationService.showErrorToast(data.errorMessage);
        }
      }, error => {
        this.progressSpinnerDialog.close();
        this.preLotteryApplicationService.showErrorToast(error?.error?.message||error?.errorMessage||error?.error?.errorMessage)
      });
    } else {
      this.isSubmitDisabled = false;
      this.formValidMessage = false;
    }
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
