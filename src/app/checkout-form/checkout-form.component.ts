import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { ICountry, ICountriesResponse, ICountriesList } from '../shared/interfaces';
import { Subscription } from "rxjs";
import { EmailValidationService } from './email-validation.service';
import Inputmask from 'inputmask';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
})
export class CheckoutFormComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder, private dataService: DataService, private emailValidationService: EmailValidationService) {
  }

  countriesList: Array<ICountry> = [];
  filteredCountriesList: Array<ICountry> = [];
  subscr: Subscription = new Subscription();
  formIsSubmitting: boolean = false;
  showModal: boolean = false;

  checkoutForm: FormGroup = this.fb.group({
    firstName: new FormControl('', { validators: [Validators.required], updateOn: "blur" }),
    lastName: new FormControl('', { validators: [Validators.required], updateOn: "blur" }),
    email: new FormControl('', {
                                validators: [Validators.email],
                                asyncValidators: [this.emailValidationService.isEmailExistsl()],
                              }),
    phoneNumbers:  this.fb.array([new FormControl('')]),
    countryControl: new FormControl('', Validators.required),
    address: new FormControl('', { validators: [Validators.required], updateOn: "blur"}),
    ccNumber: new FormControl('', { validators: [Validators.required, Validators.pattern('^\\d{4}-\\d{4}-\\d{4}-\\d{4}$')], updateOn: "blur" }),
    ccCVV: new FormControl('', { validators: 
                                [Validators.required, Validators.pattern('^\\d{3}$')],
                                updateOn: "blur"
                              }),
    agreement: new FormControl('', Validators.required)
  });

  get phoneNumbers() {
    return this.checkoutForm.controls["phoneNumbers"] as FormArray;
  }


  addPhoneNumber(): void {
    this.phoneNumbers.push( new FormControl(''));
  }


  removePhoneNumber(index: number):void {
    this.phoneNumbers.removeAt(index);
  }
  

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.checkoutForm.value.phoneNumbers = this.processPhoneNumbers(this.checkoutForm.value.phoneNumbers);
      this.submitForm();
    } else {
      Object.keys(this.checkoutForm.controls).forEach(field => {
        const control = this.checkoutForm.get(field);
        control!.markAsTouched({ onlySelf: true });
      });
      this.scrollToInvalidInput();
    }
  }
  

  processPhoneNumbers(numbers: Array<string | null>): Array<string | null> {
    return numbers.filter((el: string | null) => el);
  }


  submitForm():void {
    this.formIsSubmitting = true;
    const mockSubmission = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
    mockSubmission.then(() => {
      this.formIsSubmitting = false;
    });
    this.showModal = true;
    console.log('Form value', this.checkoutForm);
  };


  scrollToInvalidInput(): void {
    (document.querySelector('#checkoutForm .ng-invalid') as HTMLElement)!.focus()
  }


  isFieldValid(field: string): boolean {
    return this.checkoutForm.get(field)!.invalid && this.checkoutForm.get(field)!.touched;
  }


  isRequiredField(field: string): boolean {
    const validator = this.checkoutForm.controls[field].validator!({} as AbstractControl);
    if (validator && validator['required']) {
      return true;
    }
    return true;
}

  processResponseData(data: ICountriesList): Array<ICountry> {
    const countries: Array<ICountry> = [];

    Object.keys(data).forEach((key: string) => {
      countries.push(data[key])
    });

    return countries;
  }


  filterValues(searchStr: string): void {
    this.filteredCountriesList = this.countriesList.filter((item: ICountry): boolean => {
      return item.country.toLowerCase().includes(searchStr.toLowerCase());
    })
  }


  setCountryValue(country: string): void {
    this.checkoutForm.controls['countryControl'].setValue(country);
  }


  setControlValue(event: Event, controlName: string): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.checkoutForm.controls[controlName].setValue(value);
  }


  ngOnInit(): void {
    this.subscr = this.dataService.getCountries().subscribe((res: ICountriesResponse) => {
      this.countriesList = [...this.processResponseData(res.data)];
      this.filteredCountriesList = [...this.countriesList];
    });
  }

  ngAfterViewInit(): void {
    Inputmask("9999-9999-9999-9999").mask(document.querySelectorAll("input#ccNumber"));
    Inputmask("999").mask(document.querySelectorAll("input#ccCVV"));
    Inputmask("*{3,20}@*{3,20}.*{2,7}").mask(document.querySelectorAll("input#email"));
  }

  ngAfterViewChecked(): void {
    for (let i = 0; i <  this.phoneNumbers.length; i++) {
      Inputmask("(999) 999-9999").mask(document.querySelectorAll(`#phoneNumber-${i}`));
    }
  }

  ngOnDestroy(): void {
    this.subscr!.unsubscribe();
  }
}
