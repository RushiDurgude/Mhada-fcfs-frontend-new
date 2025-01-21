import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grievance-dialog',
  templateUrl: './grievance-dialog.component.html',
  styleUrls: ['./grievance-dialog.component.scss'],
})
export class GrievanceDialogComponent implements OnInit {
  id: any;
  name: string;
  constructor(public router:Router,
    public dialogRef: MatDialogRef<GrievanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

  //dialog close after clicking on ok button
  gotoList(){
    this.dialogRef.close();
  }
  //
}
