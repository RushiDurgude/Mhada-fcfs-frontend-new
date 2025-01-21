import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProjectConstants } from '../project-constants';

@Component({
  selector: 'app-attachment-error-dialog',
  templateUrl: './attachment-error-dialog.component.html',
  styleUrls: ['./attachment-error-dialog.component.scss'],
})
export class AttachmentErrorDialogComponent implements OnInit {
  isSize:boolean;
  constructor(public router: Router,
    public dialogRef: MatDialogRef<AttachmentErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    if(this.data.isSize === ProjectConstants.isSizeChecktrue){
      this.isSize=true;
    }
  }
  OkClick(){
    this.dialogRef.close(ProjectConstants.dialogCloseYes);
  }
}
