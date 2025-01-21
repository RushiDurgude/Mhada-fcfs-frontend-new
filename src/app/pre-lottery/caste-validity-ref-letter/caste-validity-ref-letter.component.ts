import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { LoaderComponent } from "src/app/loader/loader.component";
import { PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { TranslocoService } from "@ngneat/transloco";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

@Component({
  selector: "app-caste-validity-ref-letter",
  templateUrl: "./caste-validity-ref-letter.component.html",
  styleUrls: ["../pre-lottery.component.scss"],
})
export class CasteValidityRefLetterComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  applicationKey: number;
  progressSpinnerDialog: any = null;
  loaded: boolean = false;
  isApplyDisabled: boolean = false;
  submitCounter: number = 0;
  loadCounter: number = 0;
  districts: string[];
  applicationNo: string;
  applicantName: string;
  categoryCode: string;
  categoryName: string;
  districtName: string;
  maritalStatus: string;
  gender: string;
  nameBfrMarrg: string;
  nameAftrMarrg: string;
  // yourForm: FormGroup;
  selectedFile: File;
  mrriageNameChangeFile: string | ArrayBuffer;

  constructor(private preLotteryApplicationService: PreLotteryApplicationService, 
    private route: ActivatedRoute, private dialog: MatDialog,
    private router: Router, private translocoService: TranslocoService,
    private toastController: ToastController, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.applicationKey = +params["applicationKey"];

      this.loadData();
    });
  }
  
  loadData() {
    // this.displayProgressSpinner();
    this.preLotteryApplicationService
    .fetchInitForCasteValidityRefLetter(this.applicationKey)
    .subscribe((initForm) => {
      console.log(initForm);
      // this.progressSpinnerDialog.close();
      if(initForm.status === 'SUCCESS') {
        
        this.applicationNo = initForm.applicationNo;
        this.applicantName = initForm.applicantName;
        this.categoryCode = initForm.categoryCode;
        this.categoryName = initForm.categoryName;
        this.districts = initForm.districts;
        this.maritalStatus = initForm.maritalStatus;
        this.gender = initForm.gender;
        
        if(this.gender =='FEMALE' && this.maritalStatus === 'Married'){
          this.form.addControl('mrriageNameChangeFile', new FormControl(null));
        }

        this.loaded = true;
      }
      else {
        this.showErrorToast(initForm.errorMessage);
      }
    }, error => {
      this.progressSpinnerDialog.close();
      if(this.loadCounter < 1) {
        this.loadCounter++;
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
        "error-caste-validity-ref-letter-form-load").then(num => {
          this.loadData();
        });
      }
    });
  }

  submit() {
    
    if(this.gender === 'FEMALE' && this.maritalStatus === 'Married'){
      if(this.nameBfrMarrg != null){
        this.nameBfrMarrg = this.nameBfrMarrg.trim();
      }
      if(this.nameAftrMarrg != null){
        this.nameAftrMarrg = this.nameAftrMarrg.trim();
      }
    }

    var regex = /^[a-zA-Z]+(?:[ ]?[a-zA-Z]+)*$/;

    var errorMessage = "";
    if(this.gender === 'FEMALE' && this.maritalStatus === 'Married'){
      
      if(this.nameBfrMarrg){
        if(this.nameBfrMarrg.match(regex)){
        }else{
          errorMessage += "Name Before Marraige can only contain alphabets <br> ";
        }
      }else{
        errorMessage += "Please Enter Name Before Marraige <br> ";
      }

      if(this.nameAftrMarrg){
        if(this.nameAftrMarrg.match(regex)){
        }else{
          errorMessage += "Name After Marraige can only contain alphabets <br>";
        }
      }else{
        errorMessage += "Please Enter Name After Marraige<br>";
      }

      if(!this.mrriageNameChangeFile){
        errorMessage += "Please Upload Supporting Document File <br>";
      }

      if(errorMessage){
        this.showErrorToast(errorMessage);
        return;
      }
    }

    if(this.districtName && this.districtName.length > 0) {
      this.displayProgressSpinner();
      this.preLotteryApplicationService
      .applyForCasteValidityRefLetter(this.applicationKey, this.districtName, 
        this.nameBfrMarrg, this.nameAftrMarrg, this.mrriageNameChangeFile)
      .subscribe(({status, errorMessage}) => {
        this.progressSpinnerDialog.close();
        this.isApplyDisabled = false;
        if(status === 'SUCCESS') {
          this.preLotteryApplicationService.successToast(this.translocoService.translate("success-caste-validity-ref-letter-request"));
          this.router.navigate(['/app', 'application-detail-list', 'post-apps'], { replaceUrl: true });
        }
        else {
          this.showErrorToast(errorMessage);
        }
      }, error => {
        this.progressSpinnerDialog.close();
        if(this.submitCounter < 1) {
          this.submitCounter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
          "error-caste-validity-ref-letter-form-submit").then(num => {
            this.submit();
          });
        }
      });
    }
    else {
      this.showErrorToast(this.translocoService.translate("error-caste-validity-ref-letter-district-name-required"));
    }
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: false,
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

  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    console.log("this.selectedFile",this.selectedFile);
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.mrriageNameChangeFile = reader.result;
    }
   

    

  }

}
