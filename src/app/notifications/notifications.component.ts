import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { LoaderComponent } from "../loader/loader.component";
import { NotificationsService } from "./notifications.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private translocoService: TranslocoService,
    public toastController: ToastController,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    localStorage.setItem("lastRoute", this.router.url);
    this.displayProgressSpinner();
    this.notificationsService.getNotifications().subscribe(
      (response: any) => {
        response.sort((a, b) => new Date(b.notTimestamp).getTime() - new Date(a.notTimestamp).getTime());
        this.notifications = response;
        this.dataLoaded = true;
        this.progressSpinnerDialog.close();
      },
      async (error) => {
        this.progressSpinnerDialog.close();
        const toast = await this.toastController.create({
          message: this.translocoService.translate("error-notifications-load"),
          icon: "information-circle",
          position: "top",
          cssClass: "toast warning-toast",
          duration: 4000,
        });
        toast.present();
      }
    );
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }
}
