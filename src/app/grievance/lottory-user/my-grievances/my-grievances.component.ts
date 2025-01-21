import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MyGrievancesService } from './my-grievances.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ProfileService } from 'src/app/profile/profile.service';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { ProjectConstants } from '../../project-constants';
import { SharedService } from 'src/app/toolbar/shared.service';



export class GrievanceList {
  pkUsgrid: any;
  boardName: any;
  grivType: any;
  usGriSubject: string;
  createdOn: any;
  updatedOn: any;
  statusName: any;
}
@Component({
  selector: 'app-my-grievances',
  templateUrl: './my-grievances.component.html',
  styleUrls: ['./my-grievances.component.scss'],
})
export class MyGrievancesComponent implements OnInit, OnDestroy {
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  dtLan: DataTables.LanguageSettings = {};
  dtColumn: DataTables.ColumnSettings[];
  grievanceList: GrievanceList[] = [];
  time: number = 0;
  interval;
  progressSpinnerDialog: any = null;

  platform: string = "";
  lan: string;
  dtInfo: string
  someSubscription: any;
  tokenExpireMsg = ProjectConstants.tokenExpireMrMsg
  networkErrorMsg = ProjectConstants.networkErrorEnMsg
  activeLang: string = "";
  constructor(public myGrievanceService: MyGrievancesService,
    public datepipe: DatePipe,
    public sharedService: SharedService,
    private service: TranslocoService,
    public toastController: ToastController,
    private profileService: ProfileService,
    private dialog: MatDialog,
    public router: Router) { }

  ngOnInit() {
    localStorage.setItem('lastRoute', this.router.url);
    this.dtOptions = {
      pageLength: 5,
      processing: true,
      order: [],
      responsive: true,
      autoWidth: true
    };

    this.grievanceList = []
    this.platform = localStorage.getItem("platform");
    this.loadMyGrievance();
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }



  checkActiveLanguageForDatatable() {
    this.lan = this.service.getActiveLang();
    if (this.lan == "en") {
      var datatable = $('#datatableexample').DataTable();
      datatable.destroy();
      $('#datatableexample').DataTable({
        pageLength: 5,
        processing: true,
        order: [],
        responsive: true,
        autoWidth: true,
        columns: [
          {
            title: 'Grievance Id',
          },
          {
            title: 'Created Date',
          },
          {
            title: 'Board',
          },
          {
            title: 'Grievance Type',
          },
          {
            title: 'Subject',
          },
          {
            title: 'View',
          }
        ]
      });
    } else {
      var datatable = $('#datatableexample').DataTable();
      datatable.destroy();
      this.dtLan = {
        url: "assets/i18n/dt.json",
      }
      $('#datatableexample').DataTable({
        pageLength: 5,
        processing: true,
        order: [],
        responsive: true,
        language: this.dtLan,
        autoWidth: true,
        columns: [
          {
            title: 'तक्रार आयडी',
          },
          {
            title: 'तक्रार नोंद तारीख',
          },
          {
            title: 'बोर्ड',
          },
          {
            title: 'तक्रारीचा प्रकार',
          },
          {
            title: 'विषय',
          },
          {
            title: 'तक्रार पहा',
          }
        ]
      });
    }
  }


  // checkLanTokenExpire() {
  //   this.lan = this.service.getActiveLang();
  //   if (this.lan == "en") {
  //     return "Security Token is expired, please relogin with DigiLocker"
  //   } else {
  //     return "सुरक्षा टोकन कालबाह्य झाले आहे, कृपया DigiLocker सह पुन्हा लॉगिन करा"
  //   }
  // }


  async exceptionErrorToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 5000,
    });
    toast.present();
    setTimeout(() => {
      this.router.navigate([''])
    }, 2000);
  }

  async loadMyGrievance() {
    this.displayProgressSpinner();
    const response: any = await this.myGrievanceService.loadLottoryUserGrievances()
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.length != 0) {
        if (response[0].status == ProjectConstants.responseStatusSuccess) {
          for (var i = 0; i < response.length; i++) {
            // var created_date = response[i].createdOn
            var created_date = (response[i].createdOn != null && response[i].createdOn.includes("+")) ? response[i].createdOn.split("+")[0] : response[i].createdOn

            let created_on = this.datepipe.transform(created_date, 'dd/MM/yyyy hh:mm a');
            const customObj = new GrievanceList();
            customObj.pkUsgrid = response[i].pkUsgrid
            customObj.boardName = response[i].boardName
            customObj.grivType = this.text_truncate(response[i].grivType, 30, '....');
            customObj.usGriSubject = this.text_truncate(response[i].usGriSubject, 30, '....');
            customObj.createdOn = created_on
            if (response[i].tabStatus != null) {
              customObj.statusName = response[i].tabStatus.statusName
            }
            this.grievanceList.push(customObj)
          }
          this.dtTrigger.next();
          this.dtTrigger.complete()
        } else if (response[0].status == ProjectConstants.responseStatusFailure) {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg)
        } else {
          this.errorToast(response);
        }
      } else {
        this.grievanceList = []
        this.dtTrigger.next();
        // this.dtTrigger.complete()
      }
    } else {
      this.grievanceList = []
      this.errorToast(response);
    }
  }

  checkActiveLanguage() {
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
      if (this.activeLang == "en") {
        this.networkErrorMsg = ProjectConstants.networkErrorEnMsg
        this.tokenExpireMsg = ProjectConstants.tokenExpireEnMsg
      } else {
        this.networkErrorMsg = ProjectConstants.networkErrorMrMsg
        this.tokenExpireMsg = ProjectConstants.tokenExpireMrMsg
      }
    });
  }

  async errorToast(error: any) {
    this.checkActiveLanguage()
    if (error.error.message != undefined) {
      if (error.error.message.includes("JWT expired")) {
        if (this.platform == "browser" || this.platform == "browser-local") {
          alert(this.tokenExpireMsg)
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
          message: this.networkErrorMsg,
          icon: "information-circle",
          position: "top",
          cssClass: "toast error-toast",
          duration: 5000,
        });
        toast.present();
        setTimeout(() => {
          // localStorage.clear();
          this.progressSpinnerDialog.close();
          this.router.navigate([''])
        }, 2000);
      }
    } else {
      const toast = await this.toastController.create({
        message: this.networkErrorMsg,
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 5000,
      });
      toast.present();
      setTimeout(() => {
        // localStorage.clear();
        this.progressSpinnerDialog.close();
        this.router.navigate([''])
      }, 2000);
    }
  }

  text_truncate(str, length, ending) {
    if (str != null) {
      if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
      } else {
        return str;
      }
    } else {
      return null
    }
  }

  viewGrievance(obj) {
    this.router.navigate(['/view-grievance/' + obj])
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  scrollToTopVisible = false;
  @ViewChild("divToScroll") divToScroll: ElementRef;
  onScroll(event): void {
    if (this.divToScroll.nativeElement.scrollTop > 500) {
      this.scrollToTopVisible = true;
    } else {
      this.scrollToTopVisible = false;
    }
  }
}

