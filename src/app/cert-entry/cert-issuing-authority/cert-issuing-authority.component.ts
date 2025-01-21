import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/toolbar/shared.service';
import { CertEntryService } from '../cert-entry.service';
import { CertIssuingAuthorityModel } from 'src/app/pre-lottery/models/cert-issuing-authority,model';

@Component({
  selector: 'app-cert-issuing-authority',
  templateUrl: './cert-issuing-authority.component.html',
  styleUrls: ['../../pre-lottery/pre-lottery.component.scss', './cert-issuing-authority.component.scss']
})
export class CertIssuingAuthorityComponent implements OnInit {
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  issuingAuthorities: CertIssuingAuthorityModel;
  lang: string;
  @Input() categoryCode: string;
  @Input() apply: boolean = false;

  constructor(private route: ActivatedRoute, 
    private dialog: MatDialog,
    private router: Router,
    private certEntryService: CertEntryService,
    private translocoService: TranslocoService, private toastController: ToastController,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.loadData();  
    this.sharedService.name.subscribe((lang) => {
      console.log('lang', lang)
      this.lang = lang;
    });
  }

  loadData() {
    this.displayProgressSpinner();
    this.certEntryService.issuingAuthority()
    .subscribe(data => {
      this.progressSpinnerDialog.close();
      if(data.status === 'SUCCESS') {
        this.issuingAuthorities = data
        if(this.categoryCode) {
          this.issuingAuthorities.lst = this.issuingAuthorities.lst.filter(
            s => s.configKey.indexOf('('+this.categoryCode+')') >= 0);
          this.issuingAuthorities.lstMr = this.issuingAuthorities.lstMr.filter(
              s => s.configKey.indexOf('('+this.categoryCode+')') >= 0);
        }
      }
    }, error => {
      this.progressSpinnerDialog.close();
    });
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

}
