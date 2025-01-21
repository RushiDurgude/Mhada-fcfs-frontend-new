import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-objection-success-dialog',
  templateUrl: './objection-success-dialog.component.html',
  styleUrls: ['./objection-success-dialog.component.scss'],
})
export class ObjectionSuccessDialogComponent implements OnInit {
  id: any;
  name: string;
  constructor(public router:Router,
    public dialogRef: MatDialogRef<ObjectionSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

  //dialog close after clicking on ok button
  gotoList(){
    this.dialogRef.close();
  }
  //
}
