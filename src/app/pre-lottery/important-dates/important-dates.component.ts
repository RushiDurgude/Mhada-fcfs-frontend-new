import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TimelineDataModel } from '../models/timeline-data.model';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-important-dates',
  templateUrl: './important-dates.component.html',
  styleUrls: ['../pre-lottery.component.scss', './timeline.css']
})
export class ImportantDatesComponent implements OnInit {
  timelineData: TimelineDataModel[] = [];
  lotteryName: string;

  isDarkMode : boolean = false;

  constructor(private modalCtrl: ModalController, private themeService : ThemeService) { 
    this.isDarkMode = themeService.isDarkMode();
  }

  ngOnInit(): void { }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
