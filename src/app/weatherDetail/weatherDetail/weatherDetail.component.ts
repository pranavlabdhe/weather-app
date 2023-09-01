import { CommonService } from './../../common.service';
import { Component, OnInit,Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-weatherDetail',
  templateUrl: './weatherDetail.component.html',
  styleUrls: ['./weatherDetail.component.scss']
})
export class WeatherDetailComponent implements OnInit {
  // @Input() weatherData!: data[];
  searchCity: string = ''
  units: string = 'metric'
  searchCityPlacholder : string = 'SEARCH FOR CITY..'
  showDiv : boolean = false;
  // searchedCity : data | null = null;
  searchedCity!: string;
  weatherData : any;
  location : string = 'mumbai';
  formattedDate! : string;
  formatedTime! : string;
  celciusTemperature! : number;
  temperature! : number;
  checkAfterNoon : boolean = false;
  checkNight : boolean = false;
  checkMidNight : boolean = false;
  checkEvening : boolean = false;

  constructor(private weatherService: CommonService, private datePipe: DatePipe) {

    // Format date as "Friday, 12 May 2023"
    const currentDate = new Date();
    const dateOrNull: string | null = this.datePipe.transform(currentDate, 'EEEE, dd MMMM yyyy');
    this.formattedDate  = dateOrNull || '';

    // Format time as "11:44 AM"
    const timeOrNull : string | null = this.datePipe.transform(currentDate, 'hh:mm a');
    this.formatedTime = timeOrNull || '';

    // Check if it's day or night
    const timeParts = this.formatedTime.split(' ');
    if (timeParts.length === 2){
        const time = timeParts[0];
        const meridian = timeParts[1].toLowerCase();
        const hours = parseInt(time.split(':')[0],10)

        // Check Afternoon
        if((meridian === 'pm' && (hours >= 12 && hours < 6 ))) {
          this.checkAfterNoon = true;
        }
        // check Evening
        else if ((meridian === 'pm' && (hours >= 6 && hours < 9))) {
          this.checkEvening = true;
          this.checkAfterNoon = false;
          this.checkNight = false
        }
        // check Night
        else if ((meridian === 'pm' && (hours >= 9 && hours < 12) )) {
          this.checkNight = true;
          this.checkEvening = false;
          this.checkAfterNoon = false;
        }
        // check Mid Night
        else if ((meridian === 'am' && (hours >= 12 && hours < 4))) {
          this.checkMidNight = true
          this.checkEvening = false;
          this.checkAfterNoon = false;
          this.checkNight = false;
        }
        // check Day
        else if ((meridian === 'am' && (hours >= 4 && hours <= 11))) {
          this.checkAfterNoon = true;
          this.checkNight = false;
          this.checkEvening = false;
          this.checkMidNight = false;
        }
    }
   }
   search() {
    if(this.searchCity.toLowerCase().trim() !== '') {
      this.location = this.searchCity;
      this.weatherService.getWeatherData(this.location , this.units).subscribe({
        next: (data) => {
          this.weatherData = data;

          this.temperature = data.main.temp;
        },
        error: (error) =>{
          console.log(error);
        }
      })
    }else {
      return ;
    }
  }
  ngOnInit() {
    // const location = 'mumbai'; // Replace with the location you want to fetch weather data for
    this.weatherService.getWeatherData(this.location , this.units).subscribe({
      next:(data) => {
        this.weatherData = data;
        this.location = data.name;
        this.temperature = data.main.temp;
        console.log(this.weatherData);

      },
      error: (error)=>{
        console.log(error);
      }
    })
  }

  }


interface data {
  name: string;
  temperature: string;
  wind: string;
  humidity: string;
}
