import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProjectConstants } from '../project-constants';

@Component({
  selector: 'app-close-grievance-dialog',
  templateUrl: './close-grievance-dialog.component.html',
  styleUrls: ['./close-grievance-dialog.component.scss'],
})
export class CloseGrievanceDialogComponent implements OnInit {
  isFirst:boolean=false
  constructor(public router: Router,
    public dialogRef: MatDialogRef<CloseGrievanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if(this.data.id=="Close"){
      this.isFirst=true
    }else{
      this.isFirst=false
    }
  }
  onNoClick(){
    this.dialogRef.close(ProjectConstants.noMsg);
  }
  OkClick(){
    this.dialogRef.close(ProjectConstants.dialogCloseYes);
  }
}
