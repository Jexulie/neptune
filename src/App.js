import React, { Component } from 'react';

import axios from 'axios';

import Citylist from './components/Citylist';
import Clientcity from './components/Clientcity';
import Settings from './components/Settings';

import './css/app.css';

import { location_key, weather_key, photo_key } from './keys';

// TODO: Add error msg notification

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      error: null,
      listLoading: false,
      loading: true,
      clientCity: {},
      otherCities: [],
      time: null,
      tempType: 'C',
      id : 1
    }
    this.getTime = this.getTime.bind(this)
    this.callClientLocation = this.callClientLocation.bind(this);
    this.callAnotherLocation = this.callAnotherLocation.bind(this);
  }

  componentDidMount(){
    this.getTime()
    this.callClientLocation();
  }

  callClientLocation(){
    this.setState({loading: true});
    axios.get("https://jsonip.com/")
      .then(res => {
        var clientIp = res.data.ip;
        axios.get(`http://api.ipstack.com/${clientIp}?access_key=${location_key}`)
          .then(res => {
            var clientLocation = res.data.region_name;
            axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${clientLocation}&units=metric&appid=${weather_key}`)
              .then(res => {
                var clientWeather = {
                  cityName: res.data.name,
                  temperature: (res.data.main.temp).toFixed(1),
                  weatherState: res.data.weather[0].main,
                  description: res.data.weather[0].description,
                  details: {
                    humidity: res.data.main.humidity,
                    pressure: res.data.main.pressure,
                    temp_max: (res.data.main.temp_max).toFixed(1),
                    temp_min: (res.data.main.temp_min).toFixed(1),
                    wind_speed: res.data.wind.speed,
                    wind_degree: res.data.wind.deg
                  }
                }
                axios.get(`https://api.unsplash.com/photos/random?query=${clientWeather.description}+${this.state.time}+${clientLocation}+weather&client_id=${photo_key}`)
                  .then(res => {
                    var photo = {
                      large: res.data.urls.regular,
                      medium: res.data.urls.small,
                      small: res.data.urls.thumb
                    }
                    this.setState({
                      clientCity: {
                        id: 0,
                        clientWeather: clientWeather,
                        photo: photo
                      },
                      loading: false
                    })
                  })
                  .catch(err => {
                    this.setState({error: err})
                  });
              })
              .catch(err => {
                this.setState({error: err})
              });
          })
          .catch(err => {
            this.setState({error: err})
          });
      })
      .catch(err => {
        this.setState({error: err})
      });
  }

  callAnotherLocation(location){
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${weather_key}`)
      .then(res => {
        var anotherWeather = {
          cityName: res.data.name,
          temperature: (res.data.main.temp).toFixed(1),
          weatherState: res.data.weather[0].main,
          description: res.data.weather[0].description,
          details: {
            humidity: res.data.main.humidity,
            pressure: res.data.main.pressure,
            temp_max: (res.data.main.temp_max).toFixed(1),
            temp_min: (res.data.main.temp_min).toFixed(1),
            wind_speed: res.data.wind.speed,
            wind_degree: res.data.wind.deg
          }
        }
        axios.get(`https://api.unsplash.com/photos/random?query=${anotherWeather.description}+${this.state.time}+${location}+weather&client_id=${photo_key}`)
          .then(res => {
            var photo = {
              large: res.data.urls.regular,
              medium: res.data.urls.small,
              small: res.data.urls.thumb
            }
            this.setState({
              otherCities: [...this.state.otherCities, {
                  id: this.state.id,
                  anotherWeather: anotherWeather,
                  photo: photo
              }],
              id: this.state.id + 1,
              listLoading: false
            })
          })
          .catch(err => {
            this.setState({error: err})
          });
      })
      .catch(err => {
        this.setState({error: err})
      });
  }

  handleaddCity(location){
    this.callAnotherLocation(location);
  }

  handleremoveCity(id){
    var filtered = this.state.otherCities.filter(c => {
      return c.id !== id
    })
    this.setState({otherCities: filtered})
  }

  getTime(){
    var today = new Date().getHours()
    if(today >= 1 && today < 7){
      this.setState({time: 'night'});
    }else if(today >= 7 && today < 11){
      this.setState({time: 'morning'});
    }else if(today >= 11 && today < 13){
      this.setState({time: 'noon'});
    }else if(today >= 14 && today < 18){
      this.setState({time: 'evening'});
    }else if(today >= 18 && today <= 24){
      this.setState({time: 'night'});
    }
  }

  calcTemp(isCelsius){

    var toCelsius = temp => ((temp * 1.8) + 32).toFixed(1);

    var toFahrenheit = temp => ((temp - 32) * (5/9)).toFixed(1);

    var citylistTemp = this.state.otherCities.map(o => o.anotherWeather.temperature);
    var citylistDetails = this.state.otherCities.map(o => o.anotherWeather.details);

    if(isCelsius === false){
      var changedToCList = citylistTemp.map(t => toCelsius(t));
      var changedToCListDetails = citylistDetails.map(t => {
        return {
          ...t,
          temp_max: toCelsius(t.temp_max),
          temp_min: toCelsius(t.temp_min)
        }
      })
      this.setState({tempType: 'F'})
      this.setState(prevState => ({
        clientCity: {
          ...prevState.clientCity,
          clientWeather: {
            ...prevState.clientCity.clientWeather,
            temperature: toCelsius(this.state.clientCity.clientWeather.temperature),
            details: {
              ...prevState.clientCity.clientWeather.details,
              temp_max: toCelsius(this.state.clientCity.clientWeather.details.temp_max),
              temp_min: toCelsius(this.state.clientCity.clientWeather.details.temp_min)
            }
          }
        }
      })
      )
      var currCitiesC = this.state.otherCities;
      var changedCitiesC = currCitiesC.map((i, l) => {
        i.anotherWeather.temperature = changedToCList[l]
        i.anotherWeather.details = changedToCListDetails[l]
        return i
      })
      this.setState({
        otherCities: changedCitiesC
      })
    }else{
      var changedToFList = citylistTemp.map(t => toFahrenheit(t));
      var changedToFListDetails = citylistDetails.map(t => {
        return {
          ...t,
          temp_max: toFahrenheit(t.temp_max),
          temp_min: toFahrenheit(t.temp_min)
        }
      })
      this.setState({tempType: 'C'})
      this.setState(prevState => ({
        clientCity: {
          ...prevState.clientCity,
          clientWeather: {
            ...prevState.clientCity.clientWeather,
            temperature: toFahrenheit(this.state.clientCity.clientWeather.temperature),
            details: {
              ...prevState.clientCity.clientWeather.details,
              temp_max: toFahrenheit(this.state.clientCity.clientWeather.details.temp_max),
              temp_min: toFahrenheit(this.state.clientCity.clientWeather.details.temp_min)
            }
          }
        }
      })
      )
      var currCitiesF = this.state.otherCities;
      var changedCitiesF = currCitiesF.map((i, l) => {
        i.anotherWeather.temperature = changedToFList[l]
        i.anotherWeather.details = changedToFListDetails[l]
        return i
      })
      this.setState({
        otherCities: changedCitiesF
      })
    }    
  }

  render() {
      var content = (
        <div className="container">
          <Clientcity 
            clientCity={this.state.clientCity}
            loading={this.state.loading}
            tempType={this.state.tempType}
            />
          <Citylist 
            otherCities={this.state.otherCities}
            listLoading={this.state.listLoading}
            addCity={this.handleaddCity.bind(this)}
            removeCity={this.handleremoveCity.bind(this)}
            tempType={this.state.tempType}
            />
        </div>
      )
    return (
      <main className="App">
        <div className="header container center">
          <h2>Neptune Weather App</h2>
        </div>
        {content}
        <Settings
          changeTempType={this.calcTemp.bind(this)}
          />
      </main>
    );
  }
}

export default App;