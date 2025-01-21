import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import {
  AlertController,
  IonModal,
  ModalController,
  ToastController,
} from "@ionic/angular";
// import { FilterListComponent } from "../filter-list/filter-list.component";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { TranslocoService } from "@ngneat/transloco";
// import {MatIconModule} from '@angular/material/icon';
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Page } from "src/app/pre-lottery/models/Page";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { ApplicationListItemModel } from "../../models/application-list-item.model";
import { PostLotteryApplicationListItemModel } from "../../models/post-lottery-application-list";
import { PreLotteryApplicationService } from "../../services/pre-lottery-application.service";
import { FilterListComponent } from "../../filter-list/filter-list.component";
import { ApplicantEditingDetailModel } from "../../models/ApplicantEditingDetailModel";

@Component({
  selector: "photo-upload",
  templateUrl: "./photo-upload.component.html",
  styleUrls: ["./photo-upload.component.scss"],
})
export class PhotoUploadComponent implements OnInit {
  isSearchDisabled: boolean = false;
  isLoading = false;
  page: Page<ApplicationListItemModel>;
  filterForm: FormGroup = new FormGroup({});
  //   timelineData: TimelineDataModel[];
  form: FormGroup = new FormGroup({});
  applicationKey: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;

  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild("paginator1") paginator1: MatPaginator;
  selectedTab: number = 0;

  pageSizeOptions: number[] = [10, 25, 100];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;

  pageSizeOptions1: number[] = [10, 25, 100];
  totalRows1 = 0;
  pageSize1 = 10;
  currentPage1 = 0;
  counter: number = 0;
  pageMode: string;
  data: ApplicantEditingDetailModel;
  progressSpinnerDialog: any = null;
  selectedImage: File;
  applicantPhotoChecked: boolean = false;
  marriageStatusChecked: boolean = false;
  selectedOption: string = "";
  selectedFileName: string;
  selectedType: any;
  oldApplicantPhoto: string;
  @Input() selectedChild: any;

  constructor(
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController,
    private dialog: MatDialog,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      // this.displayProgressSpinner();

      this.applicationKey = +params["applicationNo"];
      this.selectedType = params["selectedType"];
      // console.log("imput for selectedChild?????",this. selectedChild);

      // console.log("this.applicationKey calling ", this.applicationKey);
      if (this.selectedType === "APPROVED") {
        console.log("this.selectedType==='APPROVED'");
      }
      this.preLotteryApplicationService
        .fetchPendingDetails(this.applicationKey, this.selectedChild)
        .subscribe((data: any) => {
          if (data.totalCount >= 1) {
            this.router.navigate([
              "/pre-lottery",
              "pending-applicant",
              this.applicationKey,
            ]);
          } else {
            this.loadData(this.applicationKey);
          }
        });

      this.saveNewImage(
        this.applicationKey,
        this.selectedChild,
        this.selectedFileName
      );
    });

    this.form = new FormGroup({
      filterText: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),

      file: new FormControl(null, Validators.required),
    });

    // console.log("selectedChild ahe ka???", this.selectedChild);
    // this.onLoad();
  }

  loadData(applicationKey: number) {
    this.displayProgressSpinner();

    this.preLotteryApplicationService
      .fetchExistingImageView(applicationKey)
      .subscribe(
        (data) => {
          this.data = data;
          this.oldApplicantPhoto = data.applicantPhoto;
          this.progressSpinnerDialog.close();
        },
        (error) => {
          this.progressSpinnerDialog.close();

          console.log(error);

          if (this.counter < 1) {
            this.counter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(error, "error-application-list-load")
              .then((num) => {
                this.loadData(applicationKey);
              });
          }
        }
      );
  }

  onSubmit() {
    // if (this.pageMode === "Add") {
    // console.log("going to save");
    this.saveNewImage(
      this.applicationKey,
      this.selectedChild,
      this.selectedFileName
    );
    // } else {
    //   console.log("going to update");
    //   // this.updateBoard();
    // }
  }

  async saveNewImage(
    applicationKey: number,
    selectedChild: string,
    selectedFileName: string
  ) {
    if (this.selectedImage) {
      // if (typeof this.selectedImage === "string") {
      const payload = this.selectedImage;

      this.preLotteryApplicationService
        .saveNewApplicantImage(
          this.oldApplicantPhoto,
          payload,
          applicationKey,
          selectedChild,
          selectedFileName
        )
        .subscribe(
          (data) => {
            if (data.status === "SUCCESS") {
              this.successToast("New Applicant Photo Saved Successfully");
              this.router.navigate(["/app/application-detail-list"]);
              this.progressSpinnerDialog.close();
            } else {
              // this.isSubmitDisabled = false;
              this.progressSpinnerDialog.close();

              this.showErrorToast(data.errorMessage);
            }
            // this.data = data;
            this.progressSpinnerDialog.close();
          },
          (error) => {
            this.progressSpinnerDialog.close();

            console.log(error);

            if (this.counter < 1) {
              this.counter++;
              this.preLotteryApplicationService
                .checkErrorForExpiredToken(error, "error-application-list-load")
                .then((num) => {
                  this.saveNewImage(
                    applicationKey,
                    selectedChild,
                    selectedFileName
                  );
                });
            }
          }
        );
      // } else {
      //   console.error("Invalid image data: expected a string");
      // }
    } else {
      console.error("No image selected");
    }
  }

  handleFileInput(event: any): void {
    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement = document.querySelector(
        "img#preview-selected-image-applicant"
      );
      if (imagePreviewElement instanceof HTMLImageElement) {
        imagePreviewElement.src = imageSrc;
        imagePreviewElement.style.display = "block";
      }
    }
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        const fileNameParts = file.name.split(".");
        const fileNameParts1 = file.name;
        const fileNameWithoutExtension = fileNameParts[0];
        this.selectedFileName = fileNameWithoutExtension;
        // this.saveNewImage(
        //   this.applicationKey,
        //   this.selectedChild,
        //   this.selectedFileName
        // );
      };
      reader.readAsDataURL(file);
    }
    console.log("reader", file.name);
  }

  onCheckboxChange() {
    // console.log("Applicant Photo:", this.applicantPhotoChecked);
    this.applicantPhotoChecked = this.selectedOption === "applicantPhoto";
    this.marriageStatusChecked = this.selectedOption === "marriageStatus";
    // console.log("Marriage Status:", this.marriageStatusChecked);
  }

  onSearch() {
    if (this.filterForm.valid) {
      this.currentPage = 0;
      this.currentPage1 = 0;
      //   this.onLoad();
    } else {
      this._snackBar.open(
        "Please enter Filter text (minimum - 3 char) for Application",
        "Close",
        {
          horizontalPosition: "right",
          verticalPosition: "top",
          panelClass: "warning-toast1",
          duration: 3 * 1000,
        }
      );
      this.isSearchDisabled = false;
    }
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  async successToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      icon: "checkmark-circle-outline",
      position: "top",
      cssClass: "toast success-toast",
      duration: 5000,
    });
    toast.present();
  }

  async warningToast() {
    await this._snackBar.open("", "Close", {
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: "warning-toast",
      duration: 3 * 1000,
    });
  }

  async errorToast(errorMessage: string, dur?: number) {
    await this._snackBar.open(errorMessage, "Close", {
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: "error-toast",
      duration: dur ? dur : 3 * 1000,
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
  resetFilter() {
    this.filterForm.controls["filterText"].setValue(null);
    this.currentPage = 0;
    this.currentPage1 = 0;
    // this.onLoad();
  }
  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterListComponent,
      componentProps: {
        timelineData: [],
      },
    });
    modal.present();
  }

  //   async displayProgressSpinner() {
  //     this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
  //       disableClose: true,
  //       panelClass: "progressSpinner",
  //     });
  //   }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.onLoad();
  }

  pageChanged1(event: PageEvent) {
    console.log({ event });
    this.pageSize1 = event.pageSize;
    this.currentPage1 = event.pageIndex;
    // this.onLoad();
  }
}
