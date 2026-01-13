import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AlertController, ModalController, ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ApplicationFormModel } from "../models/application-form.model";
import { ApplicationModel } from "../models/application.model";
import { api_url, PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { TermsAndConditionsComponent } from "../terms-and-conditions/terms-and-conditions.component";
import { ValidateMobileNumber, ValidateName } from "../validator.util";
import { ViewPdfComponent } from "../view-pdf/view-pdf.component";
import { SignaturePadComponent } from "./signature-pad/signature-pad.component";
import { SchemeModel } from "../models/scheme.model";

@Component({
  selector: "app-application",
  templateUrl: "./application.component.html",
  styleUrls: ["../pre-lottery.component.scss", "./application.component.scss"],
})
export class ApplicationComponent implements OnInit {
  scheme: SchemeModel;
  applicationFormModel: ApplicationFormModel;
  selectedAgency: string = '';
  couponCode: string = '';
  couponValid: boolean | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  lotteryKey: number;
  boardKey: number;
  schemeKey: number;
  appForm: FormGroup = new FormGroup({});
  formValidMessage: boolean = true;
  formSubmitted: boolean = false;
  application: ApplicationModel;
  isApplyDisabled: boolean = false;
  showBack: boolean = true;
  formLoadStatus: string;
  formLoadErrorMessage: string;
  progressSpinnerDialog: any = null;
  loaded: boolean = false;
  counter: number = 0;
  submitCounter: number = 0;
  loadCounter: number = 0;
  bankName: string;
  branchName: string;
  nameAsOnAccountError: boolean = false;
  // nomineeNameError: boolean[] = [false, false, false];
  // nomineeRelationshipError: boolean[] = [false, false, false];
  nomineeNameError: boolean = false;
  nomineeRelationshipError: boolean = false;
  nomineeMobileNumberError: boolean = false;
  nomineeEmailIdError: boolean = false;
  viewMode: string;


  mcgmAreaDtlError: boolean = false;
  signatureError: boolean = false;
  bankAndConfirmBankAccountError: boolean = false;
  banPassbookOrCancelledChequeError: boolean = false;
  bankError: boolean = false;
  signature: string;
  applicableCategoriesError: boolean = false;
  showNominee: boolean = false;
  stopForMCGMYes: boolean = false;
  allowedForTenementDetails: boolean = false;
  oldTenementDetails: boolean = false;

  governmentAuthorityQue: boolean = false;
  allowedFormumbaiGovAuthorityQue: boolean = false;
  fieldIsrequired: boolean = false;
  fieldIsrequired1: boolean = false;
  tenementDetailsError: boolean = false;

  showChequePassbookUpload: boolean = false;
  uploadedBankChequePassbookFile: string | ArrayBuffer;
  uploadedBankChequePassbookFileName: string;
  drawWinner: boolean = false;
  drawSpouseWinner: boolean = false;
  alreadyApplied: boolean = false;

  previewImage: string = '';
  api_url: string = '';
  selectedAgencyError: boolean = false;
  couponCodeError: boolean = false;
  isAgencyNotAllowed: string = '';

  constructor(private preLotteryApplicationService: PreLotteryApplicationService,
    private route: ActivatedRoute, private dialog: MatDialog, private router: Router,
    private toastController: ToastController, private modalCtrl: ModalController,
    private translocoService: TranslocoService, private alertController: AlertController, private fb: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.api_url = api_url;
    // this.initializeForm();
    this.route.params.subscribe((params: Params) => {
      this.boardKey = +params["boardKey"];
      this.lotteryKey = +params["lotteryKey"];
      this.schemeKey = +params["schemeKey"];
      this.loadData();
    });
    console.log('Form Controls:', this.appForm.controls);

    this.appForm = new FormGroup({
      havingMCGMArea: new FormControl(null, Validators.required),
      mcgmAreaDtl: new FormControl(null),

      isPrivateHouse: new FormControl(null),
      isTenementAllotted: new FormControl(null),
      isTenementSurrender: new FormControl(null),

      iAgree: new FormControl(null, Validators.required),
      refundMode: new FormControl(null, Validators.required),
      refundForm: new FormGroup({}),
      nomineeDetailForm: new FormGroup({}),
      selectedAgency: new FormControl(null, Validators.required),
      couponCode: new FormControl(null),
      // nomineeDetailArray: new FormArray([])
    });


    this.appForm.get('couponCode')?.valueChanges.subscribe(() => {
      this.validateCoupon();
    });

    // this.isAgencyNotAllowed = this.applicationFormModel.isAgencyNotAllowed; 

    //       console.log('Agency flag :', this.applicationFormModel.isAgencyNotAllowed);

  }

  // setSelectedAgency(event: Event) {
  //   debugger
  //   const selectedValue = (event.target as HTMLSelectElement).value;
  //   this.selectedAgency = selectedValue;
  //   console.log("Selected Agency Changed:", this.selectedAgency);
  // }
  setSelectedAgency(event: Event) {
    this.selectedAgency = (event.target as HTMLSelectElement).value;
    this.appForm.get('selectedAgency')?.setValue(this.selectedAgency);

    console.log('Selected Agency Changed:', this.selectedAgency);
    this.cdr.detectChanges();
  }

  allowAlphaNumeric(event: KeyboardEvent) {
    // const pattern = /^[a-zA-Z0-9]$/;
    const pattern = /^[a-zA-Z0-9-]$/;

    const inputChar = event.key;

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // addNewNominee() {
  //   let nomineeDetailArray: FormArray = this.appForm.get('nomineeDetailArray') as FormArray;
  //   if(nomineeDetailArray.length < 3) {
  //     nomineeDetailArray.push(new FormGroup({
  //       nomineeName: new FormControl(null, Validators.required),
  //       nomineeRelationship: new FormControl(null, Validators.required),
  //     }));
  //   }
  //   else {
  //     this.preLotteryApplicationService.showErrorToast(this.translocoService.translate('error-max-nominee'));
  //   }
  // }

  // deleteNominee(i: number) {
  //   let selectedNomineeDetailArray: FormArray = this.appForm.get('nomineeDetailArray') as FormArray;
  //   selectedNomineeDetailArray.removeAt(i);
  // }

  // get nominees() {
  //   return this.appForm.get('nomineeDetailArray')['controls'];
  // }

  initializeForm() {
    this.appForm = this.fb.group({
      havingMCGMArea: [null, Validators.required],
      mcgmAreaDtl: [null],

      isPrivateHouse: [null],
      isTenementAllotted: [null],
      isTenementSurrender: [null],

      iAgree: [null, Validators.required],
      refundMode: [null, Validators.required],
      selectedAgency: [null, Validators.required],
      couponCode: [null, Validators.required],

    });
  }

  loadData() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchApplicationFormInit(this.schemeKey)
      .subscribe((applicationFormModel) => {
        this.progressSpinnerDialog.close();
        if (applicationFormModel.status === 'SUCCESS') {
          this.applicationFormModel = applicationFormModel;
          this.isAgencyNotAllowed = applicationFormModel.isAgencyNotAllowed;
          console.log('stopForMCGMYes : ', this.applicationFormModel.stopForMCGMYes);
          console.log("Agency Types:", this.applicationFormModel.agencyTypes);
          console.log('Agency flag :', this.applicationFormModel.isAgencyNotAllowed);
          if (this.applicationFormModel.showNomineeEntry) {
            this.showNominee = true;
            this.showNomineeDetails(true);
          }

          this.stopForMCGMYes = this.applicationFormModel.stopForMCGMYes;
          this.drawWinner = this.applicationFormModel.drawWinner;
          this.drawSpouseWinner = this.applicationFormModel.drawSpouseWinner;
          this.alreadyApplied = this.applicationFormModel.alreadyApplied;
          this.showChequePassbookUpload = this.applicationFormModel.showChequePassbookUpload;

          if (this.applicationFormModel.bankVerification &&
            (this.applicationFormModel.bankVerification === 'PENNY_TEST'
              || this.applicationFormModel.bankVerification === 'NO_BANK_VERIFICATION')) {
            this.appForm.patchValue({
              refundMode: 'REFUND_TO_BANK'
            });
            this.showRefundDetails(true);
          }

          this.formLoadStatus = applicationFormModel.status;
          this.formLoadErrorMessage = applicationFormModel.errorMessage;

          if (this.applicationFormModel.lotteryCategories
            && this.applicationFormModel.lotteryCategories.length === 0) {
            this.applicableCategoriesError = true;
          }

          this.loaded = true;
        }
        else {
          this.showErrorToast(applicationFormModel.errorMessage);
          this.router.navigate(['/app', 'select-lottery', '1'], { replaceUrl: true });
        }
      }, error => {
        this.progressSpinnerDialog.close();
        if (this.counter < 1) {
          this.counter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error,
            "error-application-form-load").then(num => {
              this.loadData();
            });
        }
      });

  }

  checkCouponValidity() {
    // Trim the input value
    this.couponCode = this.appForm.get('couponCode').value?.trim() || '';

    if (!this.couponCode) {
      this.couponValid = null; // Hide messages when empty
      return;
    }
  }

  preventCopyPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }

  preventDragDrop(event: DragEvent): void {
    event.preventDefault();
  }

  validateCoupon() {
    const couponCode = this.appForm.get('couponCode')?.value;
    if (!couponCode) {
      console.warn('No Coupon Code Entered!');
      return;
    }
    console.log('Validating Coupon Code:', couponCode);
    console.log('Coupon Code Entered:', couponCode);  // Debugging Log
    if (couponCode) {
      this.preLotteryApplicationService.validateCoupon(couponCode, this.schemeKey).subscribe(
        (response) => {
          console.log('API Response:', response);  // Debugging Log
          if (response.errorMessage) {
            this.couponValid = false;
            this.errorMessage = response.errorMessage;
          } else {
            this.couponValid = true;
            this.errorMessage = '';
            this.successMessage = 'Coupon Code Applied Successfully';
          }
        },
        (error) => {
          this.couponValid = false;
          this.errorMessage = 'Invalid Coupon Code!';
          console.error(error);
        }
      );
    }
  }


  onSubmit() {
    console.log(this.appForm.valid, this.appForm.value);

    if (this.applicableCategoriesError) {
      return;
    }

    if (this.drawWinner) {
      return;
    }

    if (this.drawSpouseWinner) {
      return;
    }

    if (this.alreadyApplied) {
      return;
    }

    if (!this.appForm.value.selectedAgency && this.isAgencyNotAllowed !== 'Y') {
      this.selectedAgencyError = true;
      this.formValidMessage = false;
      this.preLotteryApplicationService.showErrorToast('Agency selection is required.');
      return;
    } else {
      this.selectedAgencyError = false;
    }

    if (this.appForm.value.selectedAgency === 'AGENT' && !this.appForm.value.couponCode && this.isAgencyNotAllowed !== 'Y') {
      this.couponCodeError = true;
      this.formValidMessage = false;
      this.preLotteryApplicationService.showErrorToast('Coupon Code is required');
      return;
    } else {
      this.couponCodeError = false;
    }

    if (this.appForm.value.selectedAgency === 'AGENT' && !this.couponValid && this.isAgencyNotAllowed !== 'Y') {
      this.preLotteryApplicationService.showErrorToast('Please enter a valid Coupon Code');
      return;
    }

    if (this.appForm.valid && ((this.appForm.value.havingMCGMArea === 'N' &&
      this.stopForMCGMYes) || !this.stopForMCGMYes)) {
      if (!this.appForm.value.iAgree) {
        this.preLotteryApplicationService.showErrorToast('Please agree to Terms and Conditions.');
        this.formValidMessage = false;
        return;
      }

      this.submitCounter = 0;
      this.mcgmAreaDtlError = false;
      this.bankAndConfirmBankAccountError = false;
      this.banPassbookOrCancelledChequeError = false;
      this.nameAsOnAccountError = false;
      this.nomineeNameError = false;
      this.nomineeRelationshipError = false;
      this.nomineeMobileNumberError = false;
      this.nomineeEmailIdError = false;
      // this.signatureError = false;
      this.bankError = false;
      this.selectedAgencyError = false;
      this.couponCodeError = false;


      console.log('mcgmareadtl---', this.appForm.value.havingMCGMArea === "Y" &&
        (!this.appForm.value.mcgmAreaDtl || this.appForm.value.mcgmAreaDtl.length === 0));

      if (!this.stopForMCGMYes) {
        if (
          this.appForm.value.havingMCGMArea === "Y" &&
          (!this.appForm.value.mcgmAreaDtl || this.appForm.value.mcgmAreaDtl.length === 0)
        ) {
          this.mcgmAreaDtlError = true;
          this.formValidMessage = false;
          return;
        }
      }

      if (this.appForm.value.refundMode === 'REFUND_TO_BANK') {
        if (this.bankName === null) {
          this.bankError = true;
          this.formValidMessage = false;
          return;
        }

        console.log('bankAccountNo-confirmBankAccountNo---', this.appForm.value.refundForm?.bankAccountNo !== this.appForm.value.refundForm?.confirmBankAccountNo);
        if (this.appForm.value.refundForm?.bankAccountNo !== this.appForm.value.refundForm?.confirmBankAccountNo) {
          this.bankAndConfirmBankAccountError = true;
          this.formValidMessage = false;
          return;
        }

        console.log('nameAsOnBank--', !ValidateName(this.appForm.value.refundForm?.nameAsOnBank));
        if (!ValidateName(this.appForm.value.refundForm?.nameAsOnBank)) {
          this.nameAsOnAccountError = true;
          this.formValidMessage = false;
          return;
        }

        if (this.showChequePassbookUpload) {
          if (!this.uploadedBankChequePassbookFile) {
            this.banPassbookOrCancelledChequeError = true;
            this.formValidMessage = false;
            return;
          }
        }
      }
      if (this.stopForMCGMYes) {
        console.log('rushi', this.appForm.value.havingMCGMArea)
        console.log('rushi', this.appForm.value.isTenementAllotted)
        console.log('rushi', this.appForm.value.isTenementSurrender)

        if (this.appForm.value.havingMCGMArea === 'N') {

          if (this.appForm.value.isTenementAllotted == null) {
            this.fieldIsrequired = true;
            return
          }

          if (this.appForm.value.isTenementAllotted === 'Y' && this.appForm.value.isTenementSurrender == null) {
            this.fieldIsrequired1 = true;
            this.fieldIsrequired = false;
            return
          }

          if (this.appForm.value.isTenementSurrender === 'Y' && this.appForm.value.mcgmAreaDtl == null) {
            this.tenementDetailsError = true;
            return
          }

        }
        // return
      }

      // if(this.stopForMCGMYes) {
      //   return
      // }

      // if(this.appForm.value.nomineeDetailArray && 
      //   this.appForm.value.nomineeDetailArray?.length > 0) {
      //   for(let p = 0; p < this.appForm.value.nomineeDetailArray?.length; p++) {
      //     let nominee = this.appForm.value.nomineeDetailArray[p];
      //     if(!ValidateName(nominee?.nomineeName)) {
      //       this.nomineeNameError[p] = true;
      //       this.formValidMessage = false;
      //       return;
      //     }
      //     if(!ValidateName(nominee?.nomineeRelationship)) {
      //       this.nomineeRelationshipError[p] = true;
      //       this.formValidMessage = false;
      //       return;
      //     }
      //   }
      // }

      if (this.showNominee) {
        if (!ValidateName(this.appForm.value.nomineeDetailForm?.nomineeName)) {
          this.nomineeNameError = true;
          this.formValidMessage = false;
          return;
        }
        if (!ValidateName(this.appForm.value.nomineeDetailForm?.nomineeRelationship)) {
          this.nomineeRelationshipError = true;
          this.formValidMessage = false;
          return;
        }
        if (!ValidateMobileNumber(this.appForm.value.nomineeDetailForm?.nomineeMobileNumber)
          || this.appForm.value.nomineeDetailForm?.nomineeMobileNumber.startsWith('0')) {
          this.nomineeMobileNumberError = true;
          this.formValidMessage = false;
          return;
        }
      }

      //console.log('signature--',!this.signature);
      // if(!this.signature) {
      //   this.signatureError = true;
      //   this.formValidMessage = false;
      //   return;
      // }

      this.submitForm();
    } else {
      this.isApplyDisabled = false;
      this.formValidMessage = false;
    }
  }

  submitForm() {
    this.displayProgressSpinner();

    // let nomineeDetailArray: {nomineePriority: number, nomineeName: string, nomineeRelationship: string}[] = [];

    // if(this.appForm.value.nomineeDetailArray && this.appForm.value.nomineeDetailArray.length > 0) {
    //   for(let t = 0; t < this.appForm.value.nomineeDetailArray.length; t++) {
    //     let nominee = this.appForm.value.nomineeDetailArray[t];
    //     nomineeDetailArray.push({nomineePriority: t+1, nomineeName: nominee.nomineeName, nomineeRelationship: nominee.nomineeRelationship});
    //   }
    // }

    this.preLotteryApplicationService
      .saveApplicationForm(
        this.schemeKey,
        this.appForm.value.lotteryCategoryKey,
        this.appForm.value.havingMCGMArea,
        this.appForm.value.mcgmAreaDtl,
        this.appForm.value.refundMode,
        this.appForm.value.refundForm?.nameAsOnBank,
        this.appForm.value.refundForm?.bankAccountNo,
        this.appForm.value.refundForm?.ifsc,
        // nomineeDetailArray,
        this.appForm.value.nomineeDetailForm?.nomineeName,
        this.appForm.value.nomineeDetailForm?.nomineeRelationship,
        this.appForm.value.nomineeDetailForm?.nomineeMobileNumber,
        this.appForm.value.nomineeDetailForm?.nomineeEmailId,
        this.signature,
        //changeRequest
        this.appForm.value.isTenementAllotted,
        this.appForm.value.isTenementSurrender,
        this.uploadedBankChequePassbookFile,
        this.appForm.value.selectedAgency,
        this.appForm.value.couponCode
      )
      .subscribe((application) => {
        this.progressSpinnerDialog.close();
        console.log('application', application);
        if (application.status === 'SUCCESS') {
          this.formSubmitted = true;
          this.application = application;
          this.showBack = false;
        }
        else {
          this.isApplyDisabled = false;
          this.showErrorToast(application.errorMessage);
        }
      }, error => {
        this.progressSpinnerDialog.close();
        this.isApplyDisabled = false;
        if (this.submitCounter < 1) {
          this.submitCounter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error,
            "error-application-form-submit").then(num => {
              this.submitForm();
            });
        }
      });
  }

  showTenementDeatailsBox(flag: boolean) {
    if (flag) {
      this.allowedForTenementDetails = true;
      this.fieldIsrequired1 = false;
    } else {
      this.fieldIsrequired1 = false;
      this.alertController
        .create({
          header: "Confirm",
          message: this.translocoService.translate("error-having-mcgm-stopflow"),
          backdropDismiss: false,
          buttons: [
            {
              text: "Ok",
              handler: () => {
                this.router.navigate(['/app', 'select-lottery', '1'], { replaceUrl: true });
              },
            },
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                this.fieldIsrequired1 = true;
                this.allowedForTenementDetails = false;
                this.appForm.patchValue({
                  isTenementSurrender: null,
                });
              },
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
      // this.fieldIsrequired1 = true;
    }

  }

  oldFlatDetailQue(flag: boolean) {
    this.oldTenementDetails = flag;
    this.allowedForTenementDetails = false;
    this.fieldIsrequired = false;
  }


  showMcgmAreadDtl(flag: boolean) {
    console.log('Flag passed:', flag);
    if (this.stopForMCGMYes) {
      if (flag) {
        this.fieldIsrequired = false;
        this.alertController
          .create({
            header: "Confirm",
            message: this.translocoService.translate("error-having-mcgm-stopflow"),
            backdropDismiss: false,
            buttons: [
              {
                text: "Ok",
                handler: () => {
                  this.router.navigate(['/app', 'select-lottery', '1'], { replaceUrl: true });
                },
              },
              {
                text: "Cancel",
                role: "cancel",
                handler: () => {
                  this.fieldIsrequired = true;
                  this.appForm.patchValue({
                    havingMCGMArea: null,
                    isTenementAllotted: null,
                    isTenementSurrender: null,
                    isPrivateHouse: null
                  });
                },
              },
            ],
          })
          .then((alert) => {
            alert.present();
          });

        this.governmentAuthorityQue = false;
        this.oldTenementDetails = false;

      } else {
        this.governmentAuthorityQue = true;
        this.fieldIsrequired = false;
      }
    }
    else {
      if (!flag) {
        this.fieldIsrequired = false;
        this.appForm.patchValue({
          mcgmAreaDtl: null,
        });
      }
    }
  }

  showNomineeDetails(flag: boolean) {
    if (flag) {
      // this.addNewNominee();
      let nomineeDetailForm: FormGroup = this.appForm.get('nomineeDetailForm') as FormGroup;
      nomineeDetailForm.addControl('nomineeName', new FormControl(null, [Validators.required]));
      nomineeDetailForm.addControl('nomineeRelationship', new FormControl(null, [Validators.required]));
      nomineeDetailForm.addControl('nomineeMobileNumber', new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]));
      nomineeDetailForm.addControl('nomineeEmailId', new FormControl(null, [Validators.required, Validators.maxLength(150), Validators.minLength(5), Validators.email]));
    }
    else {
      let nomineeDetailForm: FormGroup = this.appForm.get('nomineeDetailForm') as FormGroup;
      nomineeDetailForm.removeControl('nomineeName');
      nomineeDetailForm.removeControl('nomineeRelationship');
      nomineeDetailForm.removeControl('nomineeMobileNumber');
      nomineeDetailForm.removeControl('nomineeEmailId');
    }
  }

  showRefundDetails(flag: boolean) {
    if (flag) {
      console.log('showRefundDetails flag', flag);
      let refundForm: FormGroup = this.appForm.get('refundForm') as FormGroup;
      refundForm.addControl('nameAsOnBank', new FormControl(null, [Validators.required]));
      refundForm.addControl('bankAccountNo', new FormControl(null, Validators.required));
      refundForm.addControl('confirmBankAccountNo', new FormControl(null, Validators.required));
      refundForm.addControl('ifsc', new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]));

      // if(this.showChequePassbookUpload) {
      //   refundForm.addControl('uploadBankChequePassbookFile', new FormControl(null, [Validators.required]));
      // }

    }
    else {
      let refundForm: FormGroup = this.appForm.get('refundForm') as FormGroup;
      refundForm.removeControl('nameAsOnBank');
      refundForm.removeControl('bankAccountNo');
      refundForm.removeControl('confirmBankAccountNo');
      refundForm.removeControl('ifsc');

      // if(this.showChequePassbookUpload) {
      //   refundForm.removeControl('uploadBankChequePassbookFile');
      // }
    }

    // this.appForm.patchValue({
    //   nameAsOnBank: null,
    //   bankAccountNo: null,
    //   confirmBankAccountNo: null,
    //   ifsc: null,
    // });
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  async showErrorToast(errorMessage: string) {
    const toast = await this.toastController.create({
      message: errorMessage,
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 4000,
    });
    toast.present();
  }

  async showTermsAndConditions() {
    const modal = await this.modalCtrl.create({
      component: TermsAndConditionsComponent,
      componentProps: {
        type: "APPLICATION"
      }
    });
    modal.present();
  }

  showAcknowledgement() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchAcknowledgement(this.application?.key)
      .subscribe(async ({ status, data, errorMessage }) => {
        this.loadCounter = 0;
        if (status === 'SUCCESS') {
          this.progressSpinnerDialog.close();
          const modal = await this.modalCtrl.create({
            component: ViewPdfComponent,
            componentProps: {
              base64: data,
              documentName: "Acknowledgement",
              fileName: "ACKNOWLEDGEMENT_" + new Date().getTime() + ".pdf"
            }
          });
          modal.present();
        }
        else {
          this.progressSpinnerDialog.close();
          const toast = await this.toastController.create({
            message: errorMessage,
            icon: "information-circle",
            position: "top",
            cssClass: "toast error-toast",
            duration: 4000,
          });
          toast.present();
        }
      }, error => {
        this.progressSpinnerDialog.close();
        if (this.loadCounter < 1) {
          this.loadCounter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error,
            "error-unable-fetch-file").then(num => {
              this.showAcknowledgement();
            });
        }
      });
  }

  fetchBankDetails() {
    console.log(this.appForm.value);
    this.bankName = null;
    this.branchName = null;
    if (this.appForm.value.refundForm?.ifsc && this.appForm.value.refundForm?.ifsc.length === 11) {
      this.displayProgressSpinner();

      this.preLotteryApplicationService
        .fetchBankDetailsForIFSC(this.appForm.value.refundForm?.ifsc)
        .subscribe(async (data) => {
          this.loadCounter = 0;
          this.progressSpinnerDialog.close();
          if (data.status === 'SUCCESS') {
            this.bankName = data.bankName;
            this.branchName = data.branchName;
          }
          else {
            this.preLotteryApplicationService.showErrorToast(data.errorMessage);
          }
        }, error => {
          this.progressSpinnerDialog.close();
          if (this.loadCounter < 1) {
            this.loadCounter++;
            this.preLotteryApplicationService.checkErrorForExpiredToken(error,
              "error-unable-fetch-bank").then(num => {
                this.fetchBankDetails();
              });
          }
        });
    }
  }

  onBankChequePassbookFileSelect(event: any) {
    console.log('selected file', event.target.files[0]);
    this.uploadedBankChequePassbookFileName = null;
    if (event.target.files[0]) {
      if (event.target.files[0].size <= 1 * 1000 * 1024) {
        if (event.target.files[0].type === 'application/pdf') {
          const reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = () => {
            this.uploadedBankChequePassbookFile = reader.result;
            this.uploadedBankChequePassbookFileName = event.target.files[0].name;
          };
        }
        else {
          this.showErrorToast("Please select PDF File");
        }
      }
      else {
        this.showErrorToast("Please select File upto - " + 1 + "MB");
      }
    }
  }

  viewRefundForm() {
    return this.appForm.get('refundForm') as FormGroup;
  }

  viewNomineeDetailForm() {
    return this.appForm.get('nomineeDetailForm') as FormGroup;
  }

  async addSignature() {
    const modal = await this.modalCtrl.create({
      component: SignaturePadComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'submit') {
      this.signature = data;
    }
  }

  setPreviewImage(event) {
    this.previewImage = event;
  }

  setFileObj(event) {
    console.log('set file obj ', event);
    if (event) {
      const reader = new FileReader();
      reader.readAsDataURL(event);
      reader.onload = () => {
        this.uploadedBankChequePassbookFile = reader.result;
        this.uploadedBankChequePassbookFileName = "";
      };
    }
    else {
      this.uploadedBankChequePassbookFile = null;
      this.uploadedBankChequePassbookFileName = null;
    }
  }

}

