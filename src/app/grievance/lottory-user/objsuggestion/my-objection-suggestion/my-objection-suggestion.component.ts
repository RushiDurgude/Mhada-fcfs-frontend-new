import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { ProjectConstants } from 'src/app/grievance/project-constants';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ProfileService } from 'src/app/profile/profile.service';
import { SharedService } from 'src/app/toolbar/shared.service';
import { MyObjectionSuggestionService } from './my-objection-suggestion.service';

export class ObjectionSuggestionList {
  pkOsid: any;
  boardName: any;
  departmentName: any;
  osTypeName: string;
  uosType: any
  osSubject: any
  objectionSuggestion: any;
  createdOn: any;
}

@Component({
  selector: 'app-my-objection-suggestion',
  templateUrl: './my-objection-suggestion.component.html',
  styleUrls: ['./my-objection-suggestion.component.scss'],
})
export class MyObjectionSuggestionComponent implements OnInit {

  objSuggestionList: ObjectionSuggestionList[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  dtLan: DataTables.LanguageSettings = {};

  dtColumn: DataTables.ColumnSettings[];
  platform: string = "";
  progressSpinnerDialog: any = null;
  lan: string;
  tokenExpireMsg = ProjectConstants.tokenExpireMrMsg
  networkErrorMsg = ProjectConstants.networkErrorEnMsg
  activeLang: string = "";

  constructor(public router: Router,
    public datepipe: DatePipe,
    private dialog: MatDialog,
    public sharedService: SharedService,
    private service: TranslocoService,
    public toastController: ToastController,
    private profileService: ProfileService,
    public myobjectionSuggestionService: MyObjectionSuggestionService) { }

  ngOnInit() {
    localStorage.setItem('lastRoute', this.router.url);

    this.dtOptions = {
      pageLength: 5,
      processing: true,
      order: [],
      responsive: true,
      // language: this.dtLan,
      autoWidth: true
    };
    this.platform = localStorage.getItem("platform");
    this.loadList()
  }


  async loadList() {
    this.displayProgressSpinner();
    const response: any = await this.myobjectionSuggestionService.loadAllObjectionSuggestions()
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.length != 0) {
        if (response[0].status == ProjectConstants.responseStatusSuccess) {
          for (var i = 0; i < response.length; i++) {
            // var created_date = response[i].createdOn
            var created_date = (response[i].createdOn != null && response[i].createdOn.includes("+")) ? response[i].createdOn.split("+")[0] : response[i].createdOn

            let created_on = this.datepipe.transform(created_date, 'dd/MM/yyyy hh:mm a');
            const customObj = new ObjectionSuggestionList();
            customObj.pkOsid = response[i].pkOsid
            customObj.boardName = response[i].boardName
            customObj.uosType = response[i].uosType
            customObj.osTypeName = response[i].objectionSuggestionName
            customObj.objectionSuggestion = this.text_truncate(response[i].objectionSuggestion, 30, '....');
            customObj.osSubject = this.text_truncate(response[i].osSubject, 30, '....');
            customObj.createdOn = created_on
            this.objSuggestionList.push(customObj)
          }
          this.dtTrigger.next();
          this.dtTrigger.complete()
        } else {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg)
        }
      } else {
        this.objSuggestionList = []
      }
    } else {
      this.errorToast(response)
      this.objSuggestionList = []
    }
  }

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

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
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

  viewObjecSuggestion(id) {
    this.router.navigate(['/view-objection-suggestion/' + id])
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  checkActiveLanguageForObjDatatable() {
    this.lan = this.service.getActiveLang();
    if (this.lan == "en") {
      var datatable = $('#datatableobj').DataTable();
      datatable.destroy();
      $('#datatableobj').DataTable({
        pageLength: 5,
        processing: true,
        order: [],
        responsive: true,
        autoWidth: true,
        columns: [
          {
            title: 'Objection/Suggestion Id',
          },
          {
            title: 'Board',
          },
          {
            title: 'Objection/Suggestion Type',
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
      var datatable = $('#datatableobj').DataTable();
      datatable.destroy();
      this.dtLan = {
        url: "assets/i18n/dt.json",
      }
      $('#datatableobj').DataTable({
        pageLength: 5,
        processing: true,
        order: [],
        responsive: true,
        language: this.dtLan,
        autoWidth: true,
        columns: [
          {
            title: 'आक्षेप/सूचना आयडी',
          },
          {
            title: 'बोर्ड',
          },
          {
            title: 'आक्षेप/सूचना प्रकार',
          },
          {
            title: 'विषय',
          },
          {
            title: 'आक्षेप/सूचना पहा',
          }
        ]
      });
    }
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
