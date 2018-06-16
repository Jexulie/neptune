import React, { Component } from 'react';
import '../css/clientcity.css';

class Clientcity extends Component {
  render() {
    console.log(this.props)
    var client;
    if(this.props.listLoading === false){
      let color = this.props.clientCity.clientWeather.temperature > 40 ?
          "hot" : this.props.clientCity.clientWeather.temperature < 10 ? 
          "cold" :  this.props.clientCity.clientWeather.temperature < 40 &&
          this.props.clientCity.clientWeather.temperature > 10 ? "warm" : ""
    // TODO: Add convertion between C and F in state
    client = (
      <div className="col s12 m6">
        <div className="card horizontal">
          <div className="card-image">
            <img src={this.props.clientCity.photo.medium} alt=""/>
          </div>
          <div className="card-stacked">
            <div className="card-content">
              {/* <div className="close">
                <span className="closeCard right material-icons">clear</span>
              </div> */}
              <div className="header center">
                <h4>{this.props.clientCity.clientWeather.cityName}</h4>
              </div>
              <div className="stats">
                <div className="left">
                  <p>Humidity: {this.props.clientCity.clientWeather.details.humidity}%</p>
                  <p>Pressure: {this.props.clientCity.clientWeather.details.pressure} hPa</p>
                  <p>Max Temperature: {this.props.clientCity.clientWeather.details.temp_max}&deg;C</p>
                </div>
                <div className="right">
                  <p>Min Temperature: {this.props.clientCity.clientWeather.details.temp_min}&deg;C</p>
                  <p>Wind Degree: {this.props.clientCity.clientWeather.details.wind_degree}&deg;</p>
                  <p>Wind Speed: {this.props.clientCity.clientWeather.details.wind_speed} m/s</p>
                </div>
              </div>
              <div className="general-info">
                <div className="left">
                  <h4 className={color}>{this.props.clientCity.clientWeather.weatherState}</h4>
                </div>
                <div className="right">
                  <h3 className={color}>{this.props.clientCity.clientWeather.temperature}&deg;C</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
    }

    var loader = (
      <div>

      </div>
    )

    return (
      <div className="Clientcity">
        {client}
      </div>
    );
  }
}

export default Clientcity;
