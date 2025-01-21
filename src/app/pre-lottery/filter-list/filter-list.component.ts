import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LotteryCategoryModel } from '../models/lottery-category.model';
import { LotteryModel } from '../models/lottery.model';
import { SchemeModel } from '../models/scheme.model';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class FilterListComponent implements OnInit {
  links: string[] = [];
  selectedLink: string;
  lotteries: LotteryModel[] = [];
  schemes: SchemeModel[] = [];
  categories: LotteryCategoryModel[] = [];
  filterForm: FormGroup = new FormGroup({});

  constructor(private modalCtrl: ModalController) { 
  }
  
  ngOnInit(): void { 
    this.links = ["Lottery", "Scheme", "Category", "EMD Status"];
    
    this.filterForm = new FormGroup({
      'filterLottery': new FormControl(null),
      'filterScheme': new FormControl(null),
      'filterCategory': new FormControl(null),
      'filterEmdStatus': new FormControl(null),
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  filterLeftSideClick(link: string) {
    this.selectedLink = link;
  }

  onFilter() {
    console.log('form', this.filterForm);
  }
}
