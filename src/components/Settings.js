import React, { Component } from 'react';
import '../css/settings.css';

class Settings extends Component {
  constructor(props){
    super(props)
    this.state = {
      settingString: "settings",
      settingBar: false,
      settingContentClass: "settings-content-hidden",
      isCelcius: true,
      isLightTheme:  true
    }
  }

  handleSettingIcon(){
    if(this.state.settingBar === true){
      this.setState({
        settingString: "settings", 
        settingBar: false,
        settingContentClass: "settings-content-hidden"});
    }else{
      this.setState({
        settingString: "clear",
        settingBar: true,
        settingContentClass: "settings-content-shown"});
    }
  }

  handleTempTypeSwitch(e){
    this.props.changeTempType(!this.state.isCelcius);
    this.setState({
      isCelcius: !this.state.isCelcius
    });
  }

  handleThemeType(e){
    this.props.changeTheme(!this.state.isLightTheme);
    this.setState({
      isLightTheme: !this.state.isLightTheme
    });
  }

  render() {
    return (
      <div className="Settings">
        <div className="settings-button">
          <a onClick={this.handleSettingIcon.bind(this)} className="btn-floating btn-large    waves-effect waves-light blue darken-2 right"><i className="material-icons">  {this.state.settingString}</i></a>
        </div>
        <div className="settings-wrapper">
          <div className={this.state.settingContentClass}>
            <div className="about">
              <p>Made By Jexulie in 2018.</p>
            </div>
            <div className="options">
              <div className="switch temp">
                <label className="tempSwitch">
                  Fahrenheit
                  <input type="checkbox" checked={this.state.isCelcius} onChange={this.handleTempTypeSwitch.bind(this)}/>
                  <span className="lever"></span>
                  Celsius
                </label>
              </div>
              {/* <div className="switch theme">
                <label className="themeSwitch">
                  Dark Theme
                  <input type="checkbox" checked={this.state.isLightTheme} onChange={this.handleThemeType.bind(this)}/>
                  <span className="lever"></span>
                  Light Theme
                </label>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;