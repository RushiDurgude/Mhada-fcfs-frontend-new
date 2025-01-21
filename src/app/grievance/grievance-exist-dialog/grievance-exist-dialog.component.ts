import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectConstants } from '../project-constants';

@Component({
  selector: 'app-grievance-exist-dialog',
  templateUrl: './grievance-exist-dialog.component.html',
  styleUrls: ['./grievance-exist-dialog.component.scss'],
})
export class GrievanceExistDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GrievanceExistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {}


  onNoClick(){
    this.dialogRef.close(ProjectConstants.noMsg);
  }
  
  OkClick(){
    this.dialogRef.close(ProjectConstants.dialogCloseYes);
  }
}
