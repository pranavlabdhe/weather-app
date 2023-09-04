import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable,BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  // private apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=1046649a6930f986ba5740a6e01e6b7a&units=metric';
  // WEATHER API
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = '1046649a6930f986ba5740a6e01e6b7a';
  // TIMEZONE API
  // private apiURL = 'http://api.timezonedb.com/v2.1/get-time-zone?key=1GJ9YWW98I18&format=json&by=position&lat=19.0144&lng=72.8479'
  private apiURL = 'http://api.timezonedb.com/v2.1/get-time-zone';
  private apiTzKey = '1GJ9YWW98I18';

  //GET CITY DATA FROM LAT AND LONG will call only at ngOnInit
  private initApiUrL = 'https://api.openweathermap.org/data/2.5/weather';
  private initApitKey = '1046649a6930f986ba5740a6e01e6b7a';
  constructor(private httpClient:HttpClient) { }

    getWeatherData(city:string, units:string):Observable<any> {
      const params = new HttpParams().set('q',city).set('appid',this.apiKey).set('units',units)
      return this.httpClient.get(this.apiUrl,{ params })
    }
    getOnitData(latitude: any, longitude: any, units:string): Observable<any> {
      const params = new HttpParams().set('lat',latitude.toString()).set('lon' ,longitude.toString()).set('appid',this.initApitKey).set('units',units)
      return this.httpClient.get(this.initApiUrL,{ params })
    }

    getTimeZone(latitude: any, longitude: any): Observable<any> {
      const params = new HttpParams()
      .set('key', this.apiTzKey)
      .set('format', 'json')
      .set('by', 'position')
      .set('lat', latitude.toString())
      .set('lng', longitude.toString());

    return this.httpClient.get(this.apiURL, { params });
    }

}
