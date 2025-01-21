import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedService } from 'src/app/toolbar/shared.service';
import { LotteryMDRModel } from '../models/lottery-md.model';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['../pre-lottery.component.scss', './terms.css']
})
export class TermsAndConditionsComponent implements OnInit {
  type: string;
  mdrList: LotteryMDRModel[] = [];
  lang: string;

  constructor(private modalCtrl: ModalController, private sharedService: SharedService) { }

  ngOnInit(): void { 
    this.sharedService.name.subscribe((lang) => {
      this.lang = lang;
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
