import { WeatherTimePipePipe } from './weather-time-pipe.pipe';

describe('WeatherTimePipePipe', () => {
  it('create an instance', () => {
    const pipe = new WeatherTimePipePipe();
    expect(pipe).toBeTruthy();
  });
});
