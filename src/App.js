import React, { Component } from 'react';
import axios from 'axios';
import Citylist from './components/Citylist';
import Clientcity from './components/Clientcity';
import Settings from './components/Settings';
import './css/app.css';
import { location_key, weather_key, photo_key } from './keys';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      listLoading: true,
      loading: true,
      clientCity: {},
      otherCities: [],
      id : 1
      
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
        axios.get(`https://api.unsplash.com/photos/random?query=${anotherWeather.description}+${this.state.time}+${location}&client_id=${photo_key}`)
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
      console.log(id, c.id)
      return c.id !== id
    })
    this.setState({otherCities: filtered})
  }

  render() {
    // TODO: send css sizes as props
    var content;
    if(this.state.loading === false){
      content = (
        <div className="container">
          <Clientcity clientCity={this.state.clientCity} loading={this.state.loading} />
          <Citylist 
            otherCities={this.state.otherCities}
            listLoading={this.state.listLoading}
            addCity={this.handleaddCity.bind(this)}
            removeCity={this.handleremoveCity.bind(this)}
            />
        </div>
      )
    }
    console.log(this.state)
    return (
      <main className="App">
        {content}
        <Settings/>
      </main>
    );
  }
}

export default App;

/* Test Data 

clientCity: {
  clientWeather: {
    cityName: "Eskişehir",
    description: "clear sky",
    details: {
      humidity: 55,
      pressure: 1001,
      temp_max: 19,
      temp_min: 23,
      wind_speed: 5.3,
      wind_degree: 13
    },
    temperature: 19,
    weatherState: "Clear",
    id: 0,
    photo: {
      large: "https://images.unsplash.com/photo-1502324676454-4c4943764606?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjI0Mjk5fQ&s=1ab1197540623b0b4915cf4332d39a6b",
      medium: "https://images.unsplash.com/photo-1502324676454-4c4943764606?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjI0Mjk5fQ&s=a66873ccab107dc4849a073291392f67",
      small: "https://images.unsplash.com/photo-1502324676454-4c4943764606?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjI0Mjk5fQ&s=cb36b6bd12c00fa6fb2b0e984f3e8e9d"
    }
  }
}

  otherCities: [
    {
      anotherWeather: {
        cityName: "London",
        description: "mist",
        details: {
          humidity: 55,
          pressure: 1001,
          temp_max: 19,
          temp_min: 23,
          wind_speed: 5.3,
          wind_degree: 13
        },
        temperature: 12.46,
        weatherState: "Mist",
        id: 1,
        photo: {
          large: "https://images.unsplash.com/photo-1497216429614-5bd7dbd9fc48?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjI0Mjk5fQ&s=86aec973ac9d29d1eb6fe4418a5fd064",
          medium: "https://images.unsplash.com/photo-1497216429614-5bd7dbd9fc48?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&          fit=max&ixid=eyJhcHBfaWQiOjI0Mjk5fQ&s=d677ec77869416fea099158e7ccf4379",
          small: "https://images.unsplash.com/photo-1497216429614-5bd7dbd9fc48?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&         fit=max&ixid=eyJhcHBfaWQiOjI0Mjk5fQ&s=9c9ce355de81020fca18902506ea7d4f"
        }
      }
    }
  ]

*/





/* 

this.state = {
      error: null,
      loading: true,
      clientCity: null,
      otherCities : [],
      time: "day",
      id: 1
    }

*/






