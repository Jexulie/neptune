import React, { Component } from 'react';
import '../css/citylist.css';

class Citylist extends Component {

  constructor(props){
    super(props)
    this.state = {
      location: "",
      inputClass: "hidden"
    }
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

  render() {
    var list = this.props.otherCities.map(o => {
      var color = o.anotherWeather.temperature > 40 ?
          "hot" : o.anotherWeather.temperature < 10 ? 
          "cold" :  o.anotherWeather.temperature < 40 &&
            o.anotherWeather.temperature > 10 ? "warm" : "";
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
                    <span onClick={() => this.props.removeCity(o.id)} className="closeCard right material-icons">clear</span>
                  </div>
                  <div className="header center">
                    <h4>{o.anotherWeather.cityName}</h4>
                  </div>
                  <div className="stats">
                    <div className="left">
                      <p>Humidity: {o.anotherWeather.details.humidity}%</p>
                      <p>Pressure: {o.anotherWeather.details.pressure} hPa</p>
                      <p>Max Temperature:{o.anotherWeather.details.temp_max}&deg;C</p>
                    </div>
                    <div className="right">
                      <p>Min Temperature:{o.anotherWeather.details.temp_min}&deg;C</p>
                      <p>Wind Degree: {o.anotherWeather.details.wind_degree}&deg;</p>
                      <p>Wind Speed: {o.anotherWeather.details.wind_speed} m/s</p>
                    </div>
                  </div>
                  <div className="general-info">
                    <div className="left">
                      <h4 className={color}>{o.anotherWeather.weatherState}</h4>
                    </div>
                    <div className="right">
                      <h3 className={color}>{o.anotherWeather.temperature}&deg;C</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      )
    })

    return (
      <div className="Citylist">
        <div className="list">
          <ul>
            {list}
          </ul>
        </div>
        <div className="addCity">
          <div className="add center">
            <a onMouseEnter={this.handlehoverMouseEnter.bind(this)} onClick={this.props.addCity} className="btn-floating btn-large       waves-effect waves-light blue darken-2"><i className="material-icons">      add</i></a>
          </div>
          <div className={this.state.inputClass}>
             <div className="row">
              <form className="col m6 offset-m3">
                <div className="input-field">
                  <input id="form" placeholder="Enter a Location Like ... 'New York' or '10001" value={this.state.location}  onChange={this.handleinputChange.bind (this)} onKeyPress= {this.handleKeyPress.bind(this)} type="text"/>
                  {/* <label for="form">Location</label>   */}
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
