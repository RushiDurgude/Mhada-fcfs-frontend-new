import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ModalController, ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/toolbar/shared.service';
import { categories, CertEntryService } from '../../cert-entry.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CATEGORY_FIELDS, FIELDS } from './category-form-form-control';
import { ViewPdfComponent } from 'src/app/pre-lottery/view-pdf/view-pdf.component';
import { intervalToDuration, formatDuration } from 'date-fns';
import { api_url } from "../../../pre-lottery/services/pre-lottery-application.service";

@Component({
  selector: 'app-cert-entry-cat-auv',
  templateUrl: './cert-entry-cat-auv.component.html',
  styleUrls: ['../../../pre-lottery/pre-lottery.component.scss']
})
export class CertEntryCategoryAUVComponent implements OnInit {
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  pan: string;
  categoryCode: string;
  categoryName: {en: string, mr: string};
  form: FormGroup = new FormGroup({});
  isSubmitDisabled: boolean = false;
  selectedFieldNames: [string];
  pageMode: string = 'EDIT';
  lang: string;
  cgRetirementMinDate: Date;
  cgRetirementMaxDate: Date;
  dfRetirementDefaultMinDate: Date;
  dfRetirementMaxDate: Date;
  apiUrl: string;
  jrApprovalStatus: string;
  esignStatus: string;

  limit: number = 1;
  
  jrExperienceApptCertFile: string | ArrayBuffer;
  jrIncomeProofFile: string | ArrayBuffer;
  jrRecomLetterFile: string | ArrayBuffer;
  jrBylineArticleFile: string | ArrayBuffer;
  jrIdCardFile: string | ArrayBuffer;
  jrSelfDeclarationFile: string | ArrayBuffer;
  jrAgencyApprovlCertFile: string | ArrayBuffer;

  rejectReason: string;
  esignedJrCertificate: string | ArrayBuffer;

  jrExperienceApptCertUploaded: string | ArrayBuffer;
  jrIncomeProofUploaded: string | ArrayBuffer;
  jrRecomLetterUploaded: string | ArrayBuffer;
  jrBylineArticleUploaded: string | ArrayBuffer;
  jrIdCardUploaded: string | ArrayBuffer;
  jrSelfDeclarationUploaded: string | ArrayBuffer;
  jrAgencyApprovlCertUploaded: string | ArrayBuffer;

  constructor(private route: ActivatedRoute, 
    private dialog: MatDialog,
    private router: Router,
    private certEntryService: CertEntryService,
    private translocoService: TranslocoService, private toastController: ToastController,
    private sharedService: SharedService, private modalCtrl: ModalController) { }

  ngOnInit(): void {
    this.sharedService.name.subscribe((lang) => {
      this.lang = lang;
    });
    this.apiUrl = api_url;
    this.cgRetirementMinDate = new Date(new Date().getFullYear()-3, 
    new Date().getMonth(), new Date().getDate());
    this.cgRetirementMaxDate = new Date(new Date().getFullYear()+3, 
    new Date().getMonth(), new Date().getDate());
    this.dfRetirementMaxDate = new Date();
    this.dfRetirementDefaultMinDate = new Date(new Date().getFullYear(), 
    new Date().getMonth(), new Date().getDate()+1);

    this.route.params.subscribe((params: Params) => {
      this.pan = params['pan'];
      this.categoryCode = params['category'];

      this.categoryName = categories[this.categoryCode];
      this.selectedFieldNames = CATEGORY_FIELDS[this.categoryCode].map(
        field => field.fieldName
      );

      CATEGORY_FIELDS[this.categoryCode].forEach(
        field => this.form.removeControl(field.fieldName)
      );

      CATEGORY_FIELDS[this.categoryCode].forEach(
        field => this.form.addControl(field.fieldName, field.formControl)
      );
      

      this.loadData();
    });
  }

  goBack() {
    this.form.reset();
    this.router.navigate(['/cert-entry', 'category-dashboard', this.pan], { replaceUrl: true });
  }

  showField(fieldName) {
    return this.selectedFieldNames.indexOf(fieldName) >= 0;
  }

  loadData() {
    this.displayProgressSpinner();
    if(this.pan) {
      this.certEntryService.initCategoryFormForPAN(this.pan, this.categoryCode)
      .subscribe(data => {
        this.progressSpinnerDialog.close();
        if(data.status === 'SUCCESS') {
          if(this.categoryCode === 'JR') {
            this.limit = data.limit;
            this.jrApprovalStatus = data.approvalStatus;
            this.esignStatus = data.esignStatus;
            this.rejectReason = data.rejectReason;
            this.esignedJrCertificate = data.esignedJrCertificate;

            this.jrExperienceApptCertUploaded = data.jrExperienceApptCertUploaded;
            this.jrIncomeProofUploaded = data.jrIncomeProofUploaded;
            this.jrRecomLetterUploaded = data.jrRecomLetterUploaded;
            this.jrBylineArticleUploaded = data.jrBylineArticleUploaded;
            this.jrIdCardUploaded = data.jrIdCardUploaded;
            this.jrSelfDeclarationUploaded = data.jrSelfDeclarationUploaded;
            this.jrAgencyApprovlCertUploaded = data.jrAgencyApprovlCertUploaded;

            if(data.jrBylineArtOrVideo === 'By Line Article') {
              this.form.addControl(FIELDS.jrBylineArticle.fieldName, FIELDS.jrBylineArticle.formControl);
            }
            else if(data.jrBylineArtOrVideo === 'News Video') {
              this.form.removeControl(FIELDS.jrBylineArticle.fieldName);
            }
          }
          console.log('limit', this.limit);
          
          this.form.reset();
          console.log('form values', this.form.value);
          if(data.dataLoaded) {
            this.pageMode = 'VIEW';
            let obj = {};

            if(this.categoryCode === 'FF') {
              if(data.freedomFighterType === 'LEGAL_HEIR_FREEDOM_FIGHTER') {
                this.form.addControl(FIELDS.relation.fieldName, FIELDS.relation.formControl);
                this.form.addControl(FIELDS.freedomFighterName.fieldName, FIELDS.freedomFighterName.formControl);
              
                obj[FIELDS.relation.fieldName] = data[FIELDS.relation.fieldName];
                obj[FIELDS.freedomFighterName.fieldName] = data[FIELDS.freedomFighterName.fieldName];
              }
            }

            if(this.categoryCode === 'EX') {
              if(data.exServiceManType === 'DEPENDENT_EXSERVICEMAN') {
                this.form.addControl(FIELDS.age.fieldName, FIELDS.age.formControl);
                this.form.addControl(FIELDS.residentialAddress.fieldName, FIELDS.residentialAddress.formControl);
                this.form.addControl(FIELDS.relation.fieldName, FIELDS.relation.formControl);
                this.form.addControl(FIELDS.exServiceManName.fieldName, FIELDS.exServiceManName.formControl);
                
                obj[FIELDS.age.fieldName] = data[FIELDS.age.fieldName];
                obj[FIELDS.residentialAddress.fieldName] = data[FIELDS.residentialAddress.fieldName];
                obj[FIELDS.relation.fieldName] = data[FIELDS.relation.fieldName];
                obj[FIELDS.exServiceManName.fieldName] = data[FIELDS.exServiceManName.fieldName];
              }
            }

            this.selectedFieldNames.forEach(fieldName => {
              console.log('fieldName', fieldName);
              if(fieldName.indexOf('Date') >= 0) {
                if(data[fieldName]) {
                  obj[fieldName] = new Date(+data[fieldName]);
                }
              }
              else if(fieldName === 'exServiceManType') {
                let lst = {'EXSERVICEMAN': 'Ex-Serviceman', 'DEPENDENT_EXSERVICEMAN': 'Dependent of Ex-Serviceman'};
                obj[fieldName] = {key: data[fieldName], value: lst[data[fieldName]]};
              }
              else if(fieldName === 'freedomFighterType') {
                let lst = {'FREEDOM_FIGHTER': 'Freedom Fighter', 'LEGAL_HEIR_FREEDOM_FIGHTER': 'Legal Heir of Freedom Fighter'};
                obj[fieldName] = {key: data[fieldName], value: lst[data[fieldName]]};
              }
              else if(fieldName === 'type') {
                let lst = {'MP': 'MP', 'MLA': 'MLA', 'MLC': 'MLC'};
                obj[fieldName] = {key: data[fieldName], value: lst[data[fieldName]]};
              }
              else if(fieldName === 'jrExperienceApptCert' || 
              fieldName === 'jrIncomeProof' || fieldName === 'jrRecomLetter' || 
              fieldName === 'jrBylineArticle' || fieldName === 'jrIdCard' || 
              fieldName === 'jrSelfDeclaration' || fieldName === 'jrAgencyApprovlCert') {
                obj[fieldName] = '';
              }
              else {
                obj[fieldName] = data[fieldName];
              }
            });
            this.form.patchValue(obj);
          }
          console.log('after set form values', this.form.value);
        }
        else {
          this.certEntryService.showErrorToast(data.errorMessage);
        }
      }, error => {
        this.progressSpinnerDialog.close();
      });
    }
    else {
      this.progressSpinnerDialog.close();
      this.certEntryService.showErrorToast(this.translocoService.translate('error-invalid-pan'));
      this.router.navigate(['/cert-entry', 'pan-validation'], { replaceUrl: true });
    }
  }

  translate(str: string) {
    return this.translocoService.translate(str);
  }

  onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      if(this.categoryCode === 'MP_MLA_MLC') {
        if(new Date(this.form.value?.fromDate) > new Date(this.form.value?.endDate)) {
          this.certEntryService.showErrorToast(this.translocoService.translate('error-mpmlamlc-from-end-date'));
          return;
        }
      }

      this.displayProgressSpinner();
      let reqObj = {
        "centralGovernment": {...this.form.value},
        "stateGovernment": {...this.form.value},
        "exServiceman": {
          ...this.form.value,
          exServiceManType: this.form.value.exServiceManType?.key
        },
        "defenceFamily": {...this.form.value},
        "freedomFighter": {
          ...this.form.value,
          freedomFighterType: this.form.value.freedomFighterType?.key
        },
        "artist": {...this.form.value},
        "journalist": {
          ...this.form.value,
          jrExperienceApptCert: this.jrExperienceApptCertFile,
          jrIncomeProof: this.jrIncomeProofFile,
          jrRecomLetter: this.jrRecomLetterFile,
          jrBylineArticle: this.jrBylineArticleFile,
          jrIdCard: this.jrIdCardFile,
          jrSelfDeclaration: this.jrSelfDeclarationFile,
          jrAgencyApprovlCert: this.jrAgencyApprovlCertFile
        },
        "mpmlamlc": {
          ...this.form.value,
          type: this.form.value.type?.key
        },
      };
      this.certEntryService.submitCategoryFormWithPAN(
        this.pan,
        this.categoryCode,
        reqObj
      )
      .subscribe((data) => {
        this.progressSpinnerDialog.close();
        if(data.status === 'SUCCESS') {
          this.certEntryService.successToast(this.translocoService.translate('message-cert-entry-saved'));
          //this.pageMode = 'VIEW';
          this.ngOnInit();
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
  
  onChangeExServiceman(e) {
    console.log('ex serviceman', e);
    if(e) {
      if(e.key === 'EXSERVICEMAN') {
        this.form.removeControl(FIELDS.age.fieldName);
        this.form.removeControl(FIELDS.residentialAddress.fieldName);
        this.form.removeControl(FIELDS.relation.fieldName);
        this.form.removeControl(FIELDS.exServiceManName.fieldName);
      }
      else if(e.key === 'DEPENDENT_EXSERVICEMAN') {
        this.form.addControl(FIELDS.age.fieldName, FIELDS.age.formControl);
        this.form.addControl(FIELDS.residentialAddress.fieldName, FIELDS.residentialAddress.formControl);
        this.form.addControl(FIELDS.relation.fieldName, FIELDS.relation.formControl);
        this.form.addControl(FIELDS.exServiceManName.fieldName, FIELDS.exServiceManName.formControl);
      }
    } 
  }

  onJoiningDateChange(e) {
    console.log('joining date', e, this.categoryCode);
    console.log('retirement date', this.form.value?.retirementDate);
    let retireDate = this.categoryCode === 'DF' ? this.form.value?.dfRetirementDate 
    : this.form.value?.retirementDate;
    if(e && retireDate) {
      let totalDuration = intervalToDuration({
        start: new Date(e),
        end: new Date(retireDate)
      });

      let textDuration = formatDuration(totalDuration, { format: ['years', 'months'], delimiter: ', ' });

      console.log('textDuration',textDuration);

      let months = 0;
      let years = 0;

      if(textDuration.indexOf(',') >= 0) {
        let arr = textDuration.split(',');
        if(arr[0].indexOf('year') >= 0) {
          years = +arr[0].replace('years', '').replace('year', '');
        }
        if(arr[1].indexOf('month') >= 0) {
          months = +arr[1].replace('months', '').replace('month', '');
        }
      }
      else if(textDuration.indexOf('year') >= 0) {
        years = +textDuration.replace('years', '').replace('year', '');
      }
      else if(textDuration.indexOf('month') >= 0) {
        months = +textDuration.replace('months', '').replace('month', '');
      }

      console.log(years, months);

      if(this.categoryCode === 'DF') {
        this.form.patchValue({
          serviceYears: years,
          serviceMonths: months
        });
      }
      else if(this.categoryCode === 'EX') {
        this.form.patchValue({
          exServiceYears: years,
        });
      }
    }
  }

  onAppointmentDateChange(e) {
    console.log('appointment date', e);
    let retireDate = this.form.value?.sgRetirementDate ? 
                    new Date(this.form.value?.sgRetirementDate) : new Date();
    if(e) {
      let totalDuration = intervalToDuration({
        start: new Date(e),
        end: retireDate
      });

      let textDuration = formatDuration(totalDuration, { format: ['years', 'months'], delimiter: ', ' });

      console.log('textDuration',textDuration);

      let months = 0;
      let years = 0;

      console.log(years, months);

      if(textDuration.indexOf(',') >= 0) {
        let arr = textDuration.split(',');
        if(arr[0].indexOf('year') >= 0) {
          years = +arr[0].replace('years', '').replace('year', '');
        }
        if(arr[1].indexOf('month') >= 0) {
          months = +arr[1].replace('months', '').replace('month', '');
        }
      }
      else if(textDuration.indexOf('year') >= 0) {
        years = +textDuration.replace('years', '').replace('year', '');
      }
      else if(textDuration.indexOf('month') >= 0) {
        months = +textDuration.replace('months', '').replace('month', '');
      }

      if(this.categoryCode === 'SG') {
        this.form.patchValue({
          sgServiceYears: years,
          serviceMonths: months
        });
      }
    }
  }

  onSgRetirementDateChange(e) {
    console.log('retirement date', e);
    if(e) {
      let totalDuration = intervalToDuration({
        start: new Date(this.form.value?.appointmentDate),
        end: new Date(e)
      });

      let textDuration = formatDuration(totalDuration, { format: ['years', 'months'], delimiter: ', ' });

      console.log('textDuration',textDuration);

      let months = 0;
      let years = 0;

      console.log(years, months);

      if(textDuration.indexOf(',') >= 0) {
        let arr = textDuration.split(',');
        if(arr[0].indexOf('year') >= 0) {
          years = +arr[0].replace('years', '').replace('year', '');
        }
        if(arr[1].indexOf('month') >= 0) {
          months = +arr[1].replace('months', '').replace('month', '');
        }
      }
      else if(textDuration.indexOf('year') >= 0) {
        years = +textDuration.replace('years', '').replace('year', '');
      }
      else if(textDuration.indexOf('month') >= 0) {
        months = +textDuration.replace('months', '').replace('month', '');
      }

      if(this.categoryCode === 'SG') {
        this.form.patchValue({
          sgServiceYears: years,
          serviceMonths: months
        });
      }
    }
  }

  onDFRetirementDateChange(e) {
    console.log('joining date', this.form.value?.joiningDate);
    console.log('retirement date', e, this.categoryCode);
    if(e && this.form.value?.joiningDate) {
      let totalDuration = intervalToDuration({
        start: new Date(this.form.value?.joiningDate),
        end: new Date(e)
      });

      let textDuration = formatDuration(totalDuration, { format: ['years', 'months'], delimiter: ', ' });

      console.log('textDuration',textDuration);

      let months = 0;
      let years = 0;

      console.log(years, months);

      if(textDuration.indexOf(',') >= 0) {
        let arr = textDuration.split(',');
        if(arr[0].indexOf('year') >= 0) {
          years = +arr[0].replace('years', '').replace('year', '');
        }
        if(arr[1].indexOf('month') >= 0) {
          months = +arr[1].replace('months', '').replace('month', '');
        }
      }
      else if(textDuration.indexOf('year') >= 0) {
        years = +textDuration.replace('years', '').replace('year', '');
      }
      else if(textDuration.indexOf('month') >= 0) {
        months = +textDuration.replace('months', '').replace('month', '');
      }

      if(this.categoryCode === 'DF') {
        this.form.patchValue({
          serviceYears: years,
          serviceMonths: months
        });
      }
    }
  }

  onClickJRBylineOrVideo(e) {
    if(e && (e === 'By Line Article' || e === 'News Video')) {
      if(e === 'By Line Article') {
        if(!this.form.contains(FIELDS.jrBylineArticle.fieldName)) {
          this.form.addControl(FIELDS.jrBylineArticle.fieldName, FIELDS.jrBylineArticle.formControl);
        }
      }
      else {
        this.form.removeControl(FIELDS.jrBylineArticle.fieldName);
      }
    }
  }
  
  onRetirementDateChange(e) {
    console.log('joining date', this.form.value?.joiningDate);
    console.log('retirement date', e, this.categoryCode);
    if(e && this.form.value?.joiningDate) {
      let totalDuration = intervalToDuration({
        start: new Date(this.form.value?.joiningDate),
        end: new Date(e)
      });

      let textDuration = formatDuration(totalDuration, { format: ['years', 'months'], delimiter: ', ' });

      console.log('textDuration',textDuration);

      let months = 0;
      let years = 0;

      console.log(years, months);

      if(textDuration.indexOf(',') >= 0) {
        let arr = textDuration.split(',');
        if(arr[0].indexOf('year') >= 0) {
          years = +arr[0].replace('years', '').replace('year', '');
        }
        if(arr[1].indexOf('month') >= 0) {
          months = +arr[1].replace('months', '').replace('month', '');
        }
      }
      else if(textDuration.indexOf('year') >= 0) {
        years = +textDuration.replace('years', '').replace('year', '');
      }
      else if(textDuration.indexOf('month') >= 0) {
        months = +textDuration.replace('months', '').replace('month', '');
      }

      if(this.categoryCode === 'EX') {
        this.form.patchValue({
          exServiceYears: years,
        });
      }
    }
  }

  onChangeFreedomFighter(e) {
    console.log('freedom fighter', e);
    if(e) {
      if(e.key === 'FREEDOM_FIGHTER') {
        this.form.removeControl(FIELDS.relation.fieldName);
        this.form.removeControl(FIELDS.freedomFighterName.fieldName);
      }
      else if(e.key === 'LEGAL_HEIR_FREEDOM_FIGHTER') {
        this.form.addControl(FIELDS.relation.fieldName, FIELDS.relation.formControl);
        this.form.addControl(FIELDS.freedomFighterName.fieldName, FIELDS.freedomFighterName.formControl);
      }
    } 
  }

  jrExperienceApptCertFileSelect(e) {
    this.jrExperienceApptCertFile = e;
  }

  jrIncomeProofFileSelect(e) {
    this.jrIncomeProofFile = e;
  }

  jrRecomLetterFileSelect(e) {
    this.jrRecomLetterFile = e;
  }

  jrBylineArticleFileSelect(e) {
    this.jrBylineArticleFile = e;
  }

  jrIdCardFileSelect(e) {
    this.jrIdCardFile = e;
  }

  jrSelfDeclarationFileSelect(e) {
    this.jrSelfDeclarationFile = e;
  }

  jrAgencyApprovlCertFileSelect(e) {
    this.jrAgencyApprovlCertFile = e;
  }

  async fetchCategoryCertificate() {
    this.displayProgressSpinner();
    this.certEntryService
    .fetchCategoryCertificate(this.pan, this.categoryCode)
    .subscribe(async ({status, data, errorMessage}) => {
      if(status === 'SUCCESS') {
        this.progressSpinnerDialog.close();
        const modal = await this.modalCtrl.create({
          component: ViewPdfComponent,
          componentProps: {
            base64: data,
            documentName: this.categoryName.en+' Certificate',
            fileName: this.categoryCode+"_CERTIFICATE_"+new Date().getTime()+".pdf"
          }
        });
        modal.present();
      }
      else {
        this.progressSpinnerDialog.close();
        this.certEntryService.showErrorToast(errorMessage);
      }
    }, error => {
      this.progressSpinnerDialog.close();
      this.certEntryService.showErrorToast(error?.message||error?.error?.errorMessage);
    });
  }

  async emailCategoryCertificate() {
    this.displayProgressSpinner();
    this.certEntryService
    .emailCategoryCertificate(this.pan, this.categoryCode)
    .subscribe(async ({status, data, errorMessage}) => {
      if(status === 'SUCCESS') {
        this.progressSpinnerDialog.close();
        this.certEntryService.successToast(
          this.translocoService.translate('message-category-cert-mailed')); 
      }
      else {
        this.progressSpinnerDialog.close();
        this.certEntryService.showErrorToast(errorMessage);
      }
    }, error => {
      this.progressSpinnerDialog.close();
      this.certEntryService.showErrorToast(error?.message||error?.error?.errorMessage);
    });
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  downloadEsignedJRFile() {
    const byteArray = new Uint8Array(
      atob(this.esignedJrCertificate.toString())
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    let blob = new Blob([byteArray], { type: "application/pdf" });
    let pdfSrc = URL.createObjectURL(blob);
    window.open(pdfSrc, "_blank");
  }

}
