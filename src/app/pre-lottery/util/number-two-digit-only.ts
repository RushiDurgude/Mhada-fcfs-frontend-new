import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[numberTwoDigitOnly]'
})
export class NumberTwoDigitOnlyDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    let inputValue = input.value;
    
    // Remove any non-digit characters
    inputValue = inputValue.replace(/\D/g, '');

    // Ensure the value is no more than 2 digits
    if (inputValue.length > 2) {
      inputValue = inputValue.slice(0, 2);
    }

    // Update the input value
    input.value = inputValue;
  }
}
