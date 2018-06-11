import React, { Component } from 'react';
import axios from 'axios';
import Citylist from './components/Citylist';
import Settings from './components/Settings';
import './css/app.css';
import { location_key, weather_key, photo_key } from './keys';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      error: null,
      loading: true,
      clientCity: null,
      otherCities : [],
      time: "day",
      idDist: 1
    }
    this.callClientLocation = this.callClientLocation.bind(this);
    this.callAnotherLocation = this.callAnotherLocation.bind(this);
  }

  componentDidMount(){
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
                  temperature: res.data.main.temp,
                  weatherState: res.data.weather[0].main,
                  description: res.data.weather[0].description,
                  details: {
                    humidity: res.data.main.humidity,
                    pressure: res.data.main.pressure,
                    temp_max: res.data.main.temp_max,
                    temp_min: res.data.main.temp_min,
                    wind_speed: res.data.wind.speed,
                    wind_degree: res.data.wind.deg
                  }
                }
                axios.get(`https://api.unsplash.com/photos/random?query=${clientWeather.description}+${this.state.time}+${clientLocation}&client_id=${photo_key}`)
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
          temperature: res.data.main.temp,
          weatherState: res.data.weather[0].main,
          description: res.data.weather[0].description,
          details: {
            humidity: res.data.main.humidity,
            pressure: res.data.main.pressure,
            temp_max: res.data.main.temp_max,
            temp_min: res.data.main.temp_min,
            wind_speed: res.data.wind.speed,
            wind_degree: res.data.wind.deg
          }
        }
        // this.setState({
        //   cities : [...this.state.cities, anotherWeather],
        // })
        axios.get(`https://api.unsplash.com/photos/random?query=${anotherWeather.description}+${this.state.time}+${location}&client_id=${photo_key}`)
          .then(res => {
            var photo = {
              large: res.data.urls.regular,
              medium: res.data.urls.small,
              small: res.data.urls.thumb
            }
            this.setState({
              otherCities: [...this.state.otherCities, {
                  id: this.state.idDist,
                  anotherWeather: anotherWeather,
                  photo: photo
              }],
              idDist: this.state.idDist + 1
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

  render() {
    console.log(this.state)
    var city = ['London', 'Dublin', 'Istanbul', 'Tokyo', 'Seoul', 'Rome', 'Moscow', 'New York', 'Washington', 'Malta', 'Montreal', 'Paris']
    var list = this.state.otherCities.map(p => {
      return (
        <li key={p.id}><img src={p.photo.small} alt=""/></li>
      )
    })
    return (
      <main className="App">
        {this.state.loading !== true ? (<ul>{list}</ul>) : <p>Loading...</p>}
        <button onClick={() => this.callAnotherLocation(city[Math.floor(Math.random()*city.length)])}>Add City</button>
        <Citylist/>
        <Settings/>
      </main>
    );
  }
}

export default App;
