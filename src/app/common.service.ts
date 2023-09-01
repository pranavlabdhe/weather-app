import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  // private apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=1046649a6930f986ba5740a6e01e6b7a&units=metric';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = '1046649a6930f986ba5740a6e01e6b7a';

  // private header = new HttpHeaders({
  //   'X-RapidAPI-Key': '51c0d2e57bmsh973e11a6c7d6e41p1a1f2cjsn195db3c4340a', // Replace with your actual API key
  //   'X-RapidAPI-Host': 'yahoo-weather5.p.rapidapi.com'
  // })
  //
  //
  constructor(private httpClient:HttpClient) { }

    getWeatherData(city:string, units:string):Observable<any>{
      const params = new HttpParams().set('q',city).set('appid',this.apiKey).set('units',units)
      return this.httpClient.get(this.apiUrl,{ params })
    }
    getSearchedCity(searchCity:string) {

    }
}
