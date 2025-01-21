import { AbstractControl } from '@angular/forms';

export function ValidateName(value: string) {
  return /^[A-Za-z\s]*$/.test(value);
}

export function ValidateMobileNumber(value: string) {
  return /^\d{10}$/.test(value);
}