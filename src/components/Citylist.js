import React, { Component } from 'react';
import '../css/citylist.css';

class Citylist extends Component {

  constructor(props){
    super(props)
    this.state = {
      location: "",
      inputClass: "hidden"
    }
    this.checkColor = this.checkColor.bind(this)
  }

  handlehoverMouseEnter(){
    this.setState({inputClass: "show"})
  }

  handleKeyPress(e){
    if(e.key === 'Enter'){
      this.props.addCity(this.state.location)
      e.preventDefault();
      this.setState({
        inputClass: "hidden",
        location: ""
      })
    }
  }

  handleinputChange(e){
    this.setState({location: e.target.value})
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
    var list;
    if(this.props.listLoading === false){
      list = this.props.otherCities.map(o => {
        return(
          <li className="card-list" key={o.anotherWeather.id}>
            <div className="col s12 m6">
              <div className="card horizontal">
                <div className="card-image">
                  <img src={o.photo.medium} alt=""/>
                </div>
                <div className="card-stacked">
                  <div className="card-content">
                    <div className="close">
                      <span onClick={() => this.props.removeCity(o.id)}className="closeCard right material-icons">clear</span>
                    </div>
                    <div className="header center">
                      <h4>{o.anotherWeather.cityName}</h4>
                    </div>
                    <div className="stats">
                      <div className="left">
                        <p>Humidity: {o.anotherWeather.details.humidity}%</p>
                        <p>Pressure: {o.anotherWeather.details.pressure} hPa</p>
                        <p>Max Temperature: <span className={this.checkColor(o.anotherWeather.details.temp_max, this.props.tempType)}>{o.anotherWeather.details.temp_max}&deg;{this.props.tempType}</span></p>
                      </div>
                      <div className="right">
                        <p>Min Temperature: <span className={this.checkColor(o.anotherWeather.details.temp_min, this.props.tempType)}>{o.anotherWeather.details.temp_min}&deg;{this.props.tempType}</span></p>
                        <p>Wind Degree: {o.anotherWeather.details.wind_degree}&deg;</p>
                        <p>Wind Speed: {o.anotherWeather.details.wind_speed} m/s</p>
                      </div>
                    </div>
                    <div className="general-info">
                      <div className="left">
                        <h4 className={this.checkColor(o.anotherWeather.temperature,this.props.tempType)}>{o.anotherWeather.weatherState}</h4>
                      </div>
                      <div className="right">
                        <h3 className={this.checkColor(o.anotherWeather.temperature,this.props.tempType)}>{o.anotherWeather.temperature}&deg;{this.props.tempType}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          )
        })
    }else if(this.props.listLoading === true){
      list = (
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
      <div className="Citylist">
        <div className="list">
          <ul>
            {list}
          </ul>
        </div>
        <div className="addCity">
          <div className="add center">
            <a onMouseEnter={this.handlehoverMouseEnter.bind(this)} onClick={this.props.addCity} className="btn-floating btn-large waves-effect waves-light blue darken-2">
              <i className="material-icons">add</i>
            </a>
          </div>
          <div className={this.state.inputClass}>
             <div className="row">
              <form className="col m6 offset-m3">
                <div className="input-field">
                  <input 
                    id="form"
                    placeholder="Enter a Location Like ... 'New York'" 
                    value={this.state.location}
                    onChange={this.handleinputChange.bind (this)}
                    onKeyPress= {this.handleKeyPress.bind(this)}
                    type="text"
                    />
                </div>
              </form>
             </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Citylist;
