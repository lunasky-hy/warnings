import React, { Component } from 'react';
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from "react-offcanvas";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import './components/style/App.css';
import Map from './components/Map.js';
import Coodinate from './components/Coordinate.js';
import WarnTextForm from './components/Form.js';


class App extends Component{
  constructor(props){
    super(props);
    this.state = { 
      "feature": null,
      "isMenuOpened": false,
    };
  }

  selectFeature(feature){
    if (JSON.stringify(this.state.feature) !== JSON.stringify(feature)){
      this.setState({ "feature": feature });
    }

    if (this.state.feature){
      this.handleClick(true);
    }
  }
  
  handleClick(doopen) {
    // toggles the menu opened state
    if (doopen !== this.state.isMenuOpened){
      this.setState({ isMenuOpened: doopen });
    }
  }

  render() {
    return (
      <div className="App">
        <OffCanvas
          width={800}
          transitionDuration={400}
          effect={"parallax"}
          isMenuOpened={this.state.isMenuOpened}
          position={"right"}
        >

          <OffCanvasBody className={"canvas-body"}>
            <Coodinate feature={this.state.feature} />
            <Map click={(v) => this.selectFeature(v)} />
          </OffCanvasBody>

          <OffCanvasMenu className={"canvas-menu"}>
            <ArrowForwardIosIcon fontSize="large" onClick={()=>this.handleClick(false)} className={"canvas-back-icon"} />
            <Coodinate feature={this.state.feature} />
            <WarnTextForm feature={this.state.feature} />
          </OffCanvasMenu>
        </OffCanvas>
      </div>
    );
  }
}

export default App;
