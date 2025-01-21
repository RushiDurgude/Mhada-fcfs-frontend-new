import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cert-entry-select-cmp',
  templateUrl: './select-cmp.component.html',
  styleUrls: ['../../../../pre-lottery/pre-lottery.component.scss']
})
export class SelectCmpComponent implements OnInit {

  @Input() fieldName: string;
  @Input() fieldLabel: string;
  @Input() fieldValue: {key: string | number, value: string};
  @Input() formSubmitted: boolean;
  @Input() pageMode: string;
  @Input() controlName: AbstractControl<any, any>;
  @Input() formGroup: FormGroup<any>;
  @Input() lst: {[key: string | number]: string};
  @Output() change = new EventEmitter<{key: string, value: string}>();

  constructor() { }

  ngOnInit(): void { }
  
  showValue(o1: any, o2: any) {
    if(o1 && o2 && o1.key == o2.key) {
      return o1.value;
    }
    else {
      return "";
    }
  }

  onChange(e) {
    this.change.emit(e);
  }

}
