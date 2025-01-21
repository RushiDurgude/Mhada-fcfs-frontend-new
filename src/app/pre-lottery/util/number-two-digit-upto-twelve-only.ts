import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numberTwoDigitUptoTwelveOnly]'
})
export class NumberTwoDigitUptoTwelveOnlyDirective {
  max: number = 12; // Set the maximum allowed value to 12

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    let inputValue = input.value;
    
    // Remove any non-digit characters
    inputValue = inputValue.replace(/\D/g, '');

    // Ensure the value is no more than 2 digits
    if (inputValue.length > 2) {
      inputValue = inputValue.slice(0, 2);
    }

    // Ensure the value is within the specified range (0 to max)
    const numericValue = parseInt(inputValue, 10);
    if (!isNaN(numericValue) && numericValue > this.max) {
      inputValue = this.max.toString();
    }

    // Update the input value
    input.value = inputValue;

    // Update the form control value
    this.control.control?.setValue(inputValue);
  }
}
