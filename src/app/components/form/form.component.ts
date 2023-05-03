import { Component, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ICountry, listCountries } from 'src/app/interface/countries';
import { nifValidator } from 'src/app/shared/material/nif.validator';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit{

  formGroup!: FormGroup;
  listCountries: Array<ICountry> = listCountries;
  selectedCountry: string | undefined;
  selectedCountryIndex: number | undefined;
  selectedCity: string | undefined;
  gender: string | undefined;
  genders: Array<string> = ['male', 'female'];

  constructor() { }

  get country() {
    return this.formGroup.get('country')
  }

  countrySwitch(country: string): void {
    const index = listCountries.findIndex(x => x.name == country);
    this.selectedCountryIndex = index;
    this.selectedCity = undefined;
  }

  getCities(): Array<{name: string}>{
    return typeof this.selectedCountryIndex === 'number' ? this.listCountries[this.selectedCountryIndex].cities : [];
  }

  validateExpressions(regex: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = regex.test(control.value);
      return valid ? null : { invalidNif: true };
    }
  }

  validateAge(control: AbstractControl): ValidationErrors | null {
    const birthDate = control.value;
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 ? null : { invalidAge: true };
  }

  checkCountry(control: AbstractControl): ValidationErrors | null {
    const country = this.formGroup.get('country')?.value;
    
    if(country === 'Portugal'){
      const regex = /^(\d{4}(-)?\d{3})$/;

      if(regex.test(control.value)){
        return {invalidPostalCode: true}
      }
    }
    return null;
  }
  

  ngOnInit():void {

    this.formGroup = new FormGroup({
      fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      //nif: new FormControl('', [Validators.required, this.validateExpressions(/^([1-9])(\d{7})([0-9]|[A-Z]){1}$/)]),
      nif: new FormControl('', [Validators.required, nifValidator]),
      birthDate: new FormControl(new Date(), [Validators.required, this.validateAge]),
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      postalCode: new FormControl('',),
      phone: new FormControl('', [Validators.required, this.validateExpressions(/^([329]\d{8})$/)]),
      gender: new FormControl('', [Validators.required]),
    });

    this.formGroup.valueChanges.subscribe(value => {
      console.log(value);
    })
  
    this.formGroup.get('country')?.valueChanges.subscribe(country => {
      if(country === 'Portugal'){
        this.formGroup.get('postalCode')?.setValidators([Validators.required, this.validateExpressions(/^(\d{4})-(\d{3})$/), Validators.pattern(/^[0-9-]*$/)]);
      }
      else{
        this.formGroup.get('postalCode')?.clearValidators();
      }
    });
  }

}
