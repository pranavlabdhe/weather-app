import { CommonService } from './../../common.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-weatherDetail',
  templateUrl: './weatherDetail.component.html',
  styleUrls: ['./weatherDetail.component.scss']
})
export class WeatherDetailComponent implements OnInit {
  searchCity: string = ''
  units: string = 'metric';
  currentDateTime! : string;
  searchCityPlacholder : string = 'SEARCH FOR CITY..'
  showDiv : boolean = false;
  searchedCity!: string;
  weatherData : any;
  location : string = '';
  formattedDate! : string;
  formatedTime : string = '';
  localCityTime : string = '';
  celciusTemperature! : number;
  temperature! : number;
  checkMorning! : boolean;
  checkAfterNoon : boolean = false;
  checkNight : boolean = false;
  checkMidNight : boolean = false;
  checkEvening : boolean = false;
  feelsLike! : number;
  humidity! : number;
  windDegree! : number;
  windSpeed! : number;
  sunriseTime! : number;
  sunsetTime! : number;
  weatherDesc! : string;
  weatherMain! : string;
  visibility! : number;
  pressure! : number;
  timeZoneData : any;
  cityTimeStamp! : any;
  cityLatitude! : any;
  cityLongitude! : any;
  convertLatToString : string = '19.0144' ;
  convertLonToString : string = '72.8479' ;
  timeOfDayImage!: string;
  onInitLat : string = '';
  onInitLong : string = '';
  constructor(public weatherService: CommonService, private datePipe: DatePipe) {
   }


  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude.toString();
          const longitude = position.coords.longitude.toFixed(2).toString();
          this.onInitLat = latitude;
          this.onInitLong = longitude
          if (this.onInitLat && this.onInitLong) {
            this.getWeatherData(this.onInitLat, this.onInitLong);
          } else {
            console.error('Latitude or longitude is undefined.');
            // Handle the case where latitude or longitude is not available
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
          // Handle errors, such as when the user denies permission or if geolocation is unavailable
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Handle the case where geolocation is not supported
    }


    if (this.convertLatToString !== undefined && this.convertLonToString !== undefined) {
    this.weatherService.getTimeZone(this.convertLatToString, this.convertLonToString).subscribe({
      next : (data)=>{
        this.formatedTime = data.formatted;
        const [datePart , timePart] = this.formatedTime.split(' ')
        this.formattedDate = datePart;
        this.localCityTime = timePart
        console.log('Date:', datePart);
        console.log('Time:', timePart);
        console.log(data);
      },
      error : (error)=>{
        console.log(error);
      }
    })
    } else {
      console.log('Lat and Long not defined');
    }

  }
  getWeatherData(latitude: string, longitude: string) {
    this.weatherService.getOnitData(latitude, longitude,this.units).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.location = data.name;
        this.temperature = data.main.temp;
        this.feelsLike = data.main.feels_like
        this.windDegree = data.wind.deg;
        this.windSpeed = data.wind.speed;
        this.humidity = data.main.humidity;
        this.sunriseTime = data.sys.sunrise;
        this.sunsetTime = data.sys.sunset;
        this.weatherDesc = data.weather[0].description;
        this.weatherMain = data.weather[0].main;
        this.visibility = data.visibility / 1000;
        this.pressure = data.main.pressure;
        console.log(this.weatherData);
      },
      error: (error) => {
        console.error('Error fetching weather data:', error);
        // Handle errors from the weather service API call
      },
    });
  }

  // getLocation() {
  //   if(navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((positon)=>{
  //       const geoLat = positon.coords.latitude.toString();
  //       const geoLong = positon.coords.longitude.toString();
  //       console.log(geoLat);
  //       this.onInitLat = geoLat;
  //       this.onInitLong = geoLong;
  //     },(error)=>{
  //       console.error('Error getting user location:', error);
  //     }
  //     );
  //   } else {
  //     console.error('Geolocation is not supported by this browser.');
  //   }
  // }

  search() {
    if (this.searchCity.toLowerCase().trim() !== '') {
      this.location = this.searchCity;

      // Create an observable for the weather API call
      const weatherData$ = this.weatherService.getWeatherData(this.location, this.units);

      weatherData$.subscribe({
        next: (weatherResponse) => {
          // Handle weather data
          this.weatherData = weatherResponse;
          this.temperature = weatherResponse.main.temp;
          this.feelsLike = weatherResponse.main.feels_like;
          this.windDegree = weatherResponse.wind.deg;
          this.windSpeed = weatherResponse.wind.speed;
          this.humidity = weatherResponse.main.humidity;
          this.sunriseTime = weatherResponse.sys.sunrise;
          this.sunsetTime = weatherResponse.sys.sunset;
          this.weatherDesc = weatherResponse.weather[0].description;
          this.weatherMain = weatherResponse.weather[0].main;
          this.visibility = weatherResponse.visibility / 1000;
          this.pressure = weatherResponse.main.pressure;

          // Update latitude and longitude values
          this.cityLatitude = weatherResponse.coord.lat.toString();
          this.cityLongitude = weatherResponse.coord.lon.toString();

          // Create an observable for the timezone API call using the updated values
          const timezoneData$ = this.weatherService.getTimeZone(
            this.cityLatitude,
            this.cityLongitude
          );
          console.log(weatherResponse);

          // Use forkJoin to run both observables concurrently
          forkJoin([weatherData$, timezoneData$]).subscribe({
            next: ([_, timezoneResponse]) => {
              // Handle timezone data
              this.formatedTime = timezoneResponse.formatted;
              const [datePart , timePart] = this.formatedTime.split(' ')
              this.formattedDate = datePart;
              this.localCityTime = timePart
              // console.log('Date:', datePart);
              // console.log('Time:', timePart);

              console.log(this.formatedTime);

              // this.timeOfDayImage = this.getTimeOfDayImage(, minute);
            },
            error: (error) => {
              console.log(error);
            },
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      return;
    }
  }


}



// http://api.timezonedb.com/v2.1/get-time-zone?key=1GJ9YWW98I18&format=json&by=position&lat=LATITUDE&lng=LONGITUDE
// http://api.timezonedb.com/v2.1/get-time-zone?key=1GJ9YWW98I18&format=json&by=position&lat=51.5085&lng=0.1257
