import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementModel } from '../models/announcment.model';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';

import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/toolbar/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationListItemModel } from '../models/application-list-item.model';
import { SystemConfigModal } from '../models/systemConfigModel';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class ApplicantRequestsComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  formValidMessage: boolean = true;
  formSubmitted: boolean = false;
  isSubmitDisabled: boolean = false;
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  lang: string;
  applicationData: ApplicationListItemModel;
  requestTypes: SystemConfigModal[];
  selectedRequestType: any;
  isLoading = false;

  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService, 
    private sanitizer: DomSanitizer, private dialog: MatDialog, private toastController: ToastController,
    private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      reqType : new FormControl()
    });

    this.preLotteryApplicationService.getRequestTypes().subscribe((data) => {
      console.log("Received Data: ", data);
      if(data.status=="SUCCESS"){
        this.requestTypes = data.data;
      }else{
        this.preLotteryApplicationService.showErrorToast(data.errorMessage);
      }
    }); 
  }

  changeWebsite(e) {  
    console.log("check event value",e.target.value); 
    this.selectedRequestType = e.target.value; 

    if(this.selectedRequestType ===""){
      return alert("Please select Request Type.");
    }else{
      this.onSubmitRequestType(this.selectedRequestType);
    }
  }

  onSubmitRequestType(selectedRequestType: any){
    console.log("In onSubmitRequestType");
    console.log("selectedRequestType: ", selectedRequestType);
    this.isLoading = true;
    switch(selectedRequestType){
      case "SURRENDER_REQUEST_AFTER_POSSESSION":
        this.preLotteryApplicationService.checkEligibilityForRequest(this.selectedRequestType).subscribe((data) =>{
          console.log("Check Data of application ",data);
          if(data.status === "SUCCESS"){
            this.router.navigate(["app", "surrender-request-form", selectedRequestType, data.data], {replaceUrl: true,});
          }else if(data.status === "FAILURE"){
            this.preLotteryApplicationService.showErrorToast(data.errorMessage);
            this.isLoading = false;
          }else{
            this.isLoading = false;
          }
        });
        break;
      case "NOC CANCEL REQUEST":  
        // this.router.navigate(["/app", "applicant-requests", "surrender-request-form"], {replaceUrl: true,});
        break;
    }

  }

}
