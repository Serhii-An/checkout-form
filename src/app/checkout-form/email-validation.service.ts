import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EmailValidationService {

  constructor() {}

  isEmailExistsl(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      return new Promise<any>((resolve) => {
        setTimeout(() => {
          const randomValue = this.getRandomValue();
          resolve(randomValue === 3 ? {emailExists: true}: null);
        }, 1000);
      })
    }
  }


  getRandomValue(): number {
    return Math.floor(Math.random() * 4);
  }
}
