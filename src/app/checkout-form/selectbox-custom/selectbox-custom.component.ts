import { OnInit, Component, forwardRef, Injector, Input } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ICountry } from 'src/app/shared/interfaces';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-selectbox-custom',
  templateUrl: './selectbox-custom.component.html',
  styleUrls: ['./selectbox-custom.component.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectboxCustomComponent),
        multi: true
    }
  ]
})

export class SelectboxCustomComponent implements ControlValueAccessor, OnInit {
  @Input() countriesList: Array<ICountry> = [];

  constructor(private inj: Injector) {
    this.countryInputUpdate.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe((event: Event) => {
        this.filterValues((event.target as HTMLInputElement).value);
    });
  }
  ngControl: NgControl;
  countryInputUpdate: Subject<Event> = new Subject<Event>();

  filterValues(searchStr: string): void {
    this.countriesList = this.countriesList.filter((item: ICountry): boolean => {
      return item.country.toLowerCase().includes(searchStr.toLowerCase());
    })
  }


  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
  }

  setCountryValue(country: string){
    this.ngControl.control!.setValue(country);
  }

  public value: string | undefined;
  
  private onChange!: (value: string) => void;
  private onTouched!: () => void;

  public onInputValueChange(event: Event): void {
    const targetDivElement = event.target as HTMLInputElement;
    const value = targetDivElement.value;
    this.onChange(value);
}

  public writeValue(value: string): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: string) => void): void {
      this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
      this.onTouched = fn;
  }

}
