import React, { Component } from 'react';
import './App.css';
import Map from './components/Map.js';
import Coodinate from './components/Coordinate.js';

class App extends Component{
  constructor(props){
    super(props);
    this.state = { "feature": null };
  }

  selectFeature(feature){
    if (JSON.stringify(this.state.feature) !== JSON.stringify(feature)){
      this.setState({ "feature": feature });
    }
  }

  render() {
    return (
      <div className="App">
        <Coodinate feature={this.state.feature} />
        <Map click={(v) => this.selectFeature(v)} />
      </div>
    );
  }
}

export default App;
