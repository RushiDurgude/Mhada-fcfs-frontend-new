import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationStepService } from '../registration-step/registration-step.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-profile-selection',
  templateUrl: './profile-selection.component.html',
  styleUrls: ['./profile-selection.component.scss']
})

export class ProfileSelectionComponent {

  esigned = false;
  progressSpinnerDialog: any = null;

  constructor(
    private router: Router,
    private registrationStepService: RegistrationStepService,
    private dialog: MatDialog
  ) {}

  loadProfile() {
    this.router.navigate(['/profile']);
  }

  applyScheme() {
    this.displayProgressSpinner();
    this.registrationStepService.getProfilesEsign()
      .subscribe((data) => {
        this.closeProgressSpinner();
        if (data.status === 'SUCCESS') {
          const esigned = data.esigned;
          if (esigned) {
            this.router.navigate(
              ["/app", "select-board"],
              { replaceUrl: true }
            );
          } else {
            this.registrationStepService.frontendWarningToast(
              "Profile is not completed. Click on Load Profile to proceed.",
              false
            );
          }
        } else {
          this.registrationStepService.showErrorMessage(
            data.errorMessage,
            true
          );
        }
      }, error => {
        this.closeProgressSpinner();
        this.registrationStepService.frontendWarningToast(
          "Unable to verify profile details. Please try again.",
          true
        );
      });
  }

  async displayProgressSpinner() {
      this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
          disableClose: true,
          panelClass: "progressSpinner",
      });
    }

     async closeProgressSpinner() {
    if(this.progressSpinnerDialog) {
      this.progressSpinnerDialog.close();
    }
  }
}