import { Component, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ICountry, listCountries } from 'src/app/interface/countries';

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

  validateNIF(nif: AbstractControl): ValidationErrors | null {
    const value = nif.value?.toString() || '';
    if (!['1', '2', '3', '5', '6', '8'].includes(value.substring(0, 1)) &&
        !['45', '70', '71', '72', '77', '79', '90', '91', '98', '99'].includes(value.substring(0, 2))) {
      return { invalidNif: true };
    }
    const total = Number(value[0]) * 9 + Number(value[1]) * 8 + Number(value[2]) * 7 + Number(value[3]) * 6
      + Number(value[4]) * 5 + Number(value[5]) * 4 + Number(value[6]) * 3 + Number(value[7]) * 2;
    const modulo11 = total - Math.trunc(total / 11) * 11;
    const comparador = modulo11 === 1 || modulo11 === 0 ? 0 : 11 - modulo11;
    return Number(value[8]) === comparador ? null : { invalidNif: true };
  }
  

  submitForm(){
    console.log(this.formGroup.value);
  }

  ngOnInit():void {

    this.formGroup = new FormGroup({
      fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, this.validateExpressions(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
      nif: new FormControl('', [Validators.required, this.validateNIF, Validators.maxLength(9), Validators.minLength(9)]),
      birthDate: new FormControl(new Date(), [Validators.required, this.validateAge]),
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      postalCode: new FormControl('',),
      phone: new FormControl('', [Validators.required, this.validateExpressions(/^([329]\d{8})$/), Validators.maxLength(9), Validators.minLength(9)]),
      gender: new FormControl('', [Validators.required]),
    });

    this.formGroup.valueChanges.subscribe(value => {
      console.log(this.formGroup.valid);
    })
  
    this.formGroup.get('country')?.valueChanges.subscribe(country => {
      this.formGroup.get('postalCode')?.setValue('');
      if(country === 'Portugal'){
        this.formGroup.get('postalCode')?.setValidators([Validators.required, this.validateExpressions(/^(\d{4})-(\d{3})$/), Validators.pattern(/^[0-9-]*$/)]);
      }
      else{
        this.formGroup.get('postalCode')?.clearValidators();
      }
    });
  }

}
