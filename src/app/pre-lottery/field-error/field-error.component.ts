import { Component, Input } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'field-error-component',
    templateUrl: 'field-error.component.html',
    styleUrls: ['field-error.component.scss']
})

export class FieldErrorComponent {
  
  errorMsgList: any = [];
  
  @Input() controlName: AbstractControl | AbstractControlDirective;
  @Input() formSubmitted: boolean;

  constructor(private translocoService: TranslocoService) { }
  
  errorMessage = {
    'required'  : (params)  => `This field is required`,
    'maxlength' : (params)  => `Maximum ${params.requiredLength} characters are allowed`,
    'minlength' : (params)  => `Minimum ${params.requiredLength} characters are required`,
    'pattern'   : (params)  => `Invalid format`,
    'min'       : (params)  => `Minimum is ${params.min}`,
    'whitespace': (params)   => `White spaces are not allowed`,
    'email': (params)   => `Please enter valid Email`,
    'customPattern': (params) => this.translocoService.translate(params),
    'matDatetimePickerMin' : (params)  => `Minimum allowed is ${params.min}`,
    'matDatetimePickerMax' : (params)  => `Maximum allowed is ${params.min}`,
  };

  listErrors() {
    if (!this.controlName) return [];
    if (this.controlName.errors) {
      this.errorMsgList = [];
      Object.keys(this.controlName.errors).map( error => {
        this.controlName.touched || this.controlName.dirty || this.formSubmitted ?
        this.errorMsgList.push(this.errorMessage[error](this.controlName.errors[error])) : '';
      });
      return this.errorMsgList;
    }
    else {
        return [];
    }
  }
}