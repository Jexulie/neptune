import React, { Component } from 'react';
import '../css/clientcity.css';

class Clientcity extends Component {

  constructor(props){
    super(props)
    this.checkColor = this.checkColor.bind(this)
  }

  checkColor(temp, type){
    if(type === 'F'){
      return  temp > 104 ?
                "hot" : temp < 50 ? 
                  "cold" :  temp < 104 &&
                    temp > 50 ? "warm" : "";
    }else if(type === 'C'){
      return temp > 40 ?
              "hot" : temp < 10 ? 
                "cold" :  temp < 40 &&
                  temp > 10 ? "warm" : "";
    }
  }

  render() {
    var client;
    if(this.props.loading === false){
      client = (
        <div className="col s12 m6">
          <div className="card horizontal">
            <div className="card-image">
              <img src={this.props.clientCity.photo.medium} alt=""/>
            </div>
            <div className="card-stacked">
              <div className="card-content">
                <div className="header center">
                  <h4>{this.props.clientCity.clientWeather.cityName}</h4>
                </div>
                <div className="stats">
                  <div className="left">
                    <p>Humidity: {this.props.clientCity.clientWeather.details.humidity}%</p>
                    <p>Pressure: {this.props.clientCity.clientWeather.details.pressure}   hPa</p>
                    <p>Max Temperature: <span className={this.checkColor(this.props.clientCity.clientWeather.details.temp_max, this.props.tempType)}>{this.props.clientCity.clientWeather.details.temp_max}&deg; {this.props.tempType}</span></p>
                  </div>
                  <div className="right">
                    <p>Min Temperature: <span className={this.checkColor(this.props.clientCity.clientWeather.details.temp_min, this.props.tempType)}>{this.props.clientCity.clientWeather.details.temp_min}&deg; {this.props.tempType}</span></p>
                    <p>Wind Degree:   {this.props.clientCity.clientWeather.details.wind_degree}&deg;</p>
                    <p>Wind Speed: {this.props.clientCity.clientWeather.details.wind_speed}   m/s</p>
                  </div>
                </div>
                <div className="general-info">
                  <div className="left">
                    <h4 className={this.checkColor(this.props.clientCity.clientWeather.temperature,this.props.tempType)}>{this.props.clientCity.clientWeather.weatherState}</h4>
                  </div>
                  <div className="right">
                    <h3 className={this.checkColor(this.props.clientCity.clientWeather.temperature,this.props.tempType)}>{this.props.clientCity.clientWeather.temperature}&deg;{this.props.tempType}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }else if(this.props.loading === true){
      client = (
        <div className="container center">
          <div className="preloader-wrapper active">
            <div className="spinner-layer spinner-blue-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div>
              <div className="gap-patch">
                <div className="circle"></div>
              </div>
              <div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="Clientcity">
        {client}
      </div>
    );
  }
}

export default Clientcity;
