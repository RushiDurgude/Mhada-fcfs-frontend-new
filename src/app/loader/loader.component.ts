import { Component, OnInit } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {

  progressSpinnerStroke = 5;
  progressSpinnerMode: ProgressSpinnerMode = 'indeterminate';

  constructor() { }

  ngOnInit() {}

}
