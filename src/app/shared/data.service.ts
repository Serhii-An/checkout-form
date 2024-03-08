import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICountriesResponse } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }
  
  countriesAPIUrl = '/data/v1/countries';
  getCountries(): Observable<ICountriesResponse> {
    return this.http.get<ICountriesResponse>(this.countriesAPIUrl);
  }
}
