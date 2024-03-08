export interface ICountry {
    country: string,
    region: string
}

export interface ICountriesList {
    [key: string]: ICountry}
   

export interface ICountriesResponse {
    status: string;
    statusCode: number;
    version: string;
    access: string;
    data: ICountriesList;
}