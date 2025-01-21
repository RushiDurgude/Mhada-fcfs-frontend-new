import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cert-entry-datepicker-cmp',
  templateUrl: './datepicker-cmp.component.html',
  styleUrls: ['../../../../pre-lottery/pre-lottery.component.scss', './datepicker-cmp.component.scss']
})
export class DatePickerCmpComponent implements OnInit {

  @Input() fieldName: string;
  @Input() fieldLabel: string;
  @Input() fieldValue: string;
  @Input() formSubmitted: boolean;
  @Input() pageMode: string;
  @Input() controlName: AbstractControl<any, any>;
  @Input() formGroup: FormGroup<any>;
  @Output() change = new EventEmitter<string>();
  @Input() max: Date;
  @Input() min: Date;
  @Input() helpText: string;
  @Input() mandatory: boolean = true;

  constructor() { }
  
  ngOnInit(): void { }

  parseDate(ti) {
    console.log('ti', ti);
    if(ti) {
      let dt = new Date(ti);
      return (dt.getDate().toString().length === 1 ? '0'+dt.getDate() : dt.getDate())
      +"/"+(dt.getMonth()+1)+"/"+dt.getFullYear();
    }
    else {
      return "";
    }
  }

  onChange(e) {
    this.change.emit(e);
  }

}
