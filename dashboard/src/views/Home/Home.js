import React, {Component} from 'react';
// import { Link } from 'react-router'; import superagent from 'superagent';
// import moment from 'moment';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange() {
    console.log("Change")
  }

  componentDidMount() {}

  render() {
    return (
      <div className="conatiner">
        <div className="custom-container">
          <div
            style={{
            "padding-left": 10 + '%',
            "padding-top": 5 + '%',
            "color": "white"
          }}>
            <h1>P10 Labs</h1>
          </div>

          <div className="container clearfix">
            <div className="row">
              <div className="col-sm-4">
                <div className="card custom-card">
                  <div className="card-body text-center">
                    <h5 className="card-title card-title-custom">Gender Classification</h5>
                    <a href="#" type="button" className="btn-floating button-floating-custom">
                      <i className="fa fa-venus-mars i-custom" aria-hidden="false"></i>
                    </a>
                  </div>
                  <div className="text-center">
                    <button type="button" className="btn btn-primary btn-primary-custom">Try this API</button>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card custom-card">
                  <div className="card-body text-center">
                    <h5 className="card-title card-title-custom">Text Classification</h5>
                    <a href="#" type="button" className="btn-floating button-floating-custom">
                      <i className="fa fa-file-text-o i-custom" aria-hidden="false"></i>
                    </a>
                  </div>
                  <div className="text-center">
                    <button type="button" className="btn btn-primary btn-primary-custom">Try this API</button>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card custom-card">
                  <div className="card-body text-center">
                    <h5 className="card-title card-title-custom">Image Classification</h5>
                    <a href="#" type="button" className="btn-floating button-floating-custom">
                      <i className="fa fa-camera i-custom" aria-hidden="false"></i>
                    </a>
                  </div>
                  <div className="text-center">
                    <button type="button" className="btn btn-primary btn-primary-custom">Try this API</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container text-center text-container">
          <div className="row">
            <div className="col-sm-12">
              <form>
                <h2 style={{"color": "dimgray"}}>Gender Classification </h2>
                <label></label>
                <input className="custom-text text-center" type="text" placeholder="Enter a name" value={this.state.inputvalue} onChange={this.handleChange}/>
                <a href="#" type="button" className="btn-floating button-floating-custom2">Go!</a>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;