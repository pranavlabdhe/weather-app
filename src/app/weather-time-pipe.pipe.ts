import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weatherTimePipe'
})
export class WeatherTimePipePipe implements PipeTransform {

  transform(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    // Format hours to be in 12-hour format
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  }
}
