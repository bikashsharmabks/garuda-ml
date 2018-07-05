import React, {Component} from 'react';
// import { Link } from 'react-router'; import superagent from 'superagent';
// import moment from 'moment';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (

      <div className="custom-container">
        <div
          style={{
          "padding-left": 10 + '%',
          "padding-top": 5 + '%'
        }}>
          <h1>P10 Labs</h1>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-4">
              <div className="card custom-card">
                <div className="card-body text-center">
                  <h5 className="card-title text-muted">Gender Classification</h5>
                  <a href="#" type="button" className="btn-floating button-custom">
                    <i className="fa fa-venus-mars" aria-hidden="false"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card custom-card">
                <div className="card-body text-center">
                  <h5 className="card-title text-muted">Text Classification</h5>
                  <a href="#" type="button" className="btn-floating button-custom">
                    <i className="fa fa-file-text-o" aria-hidden="false"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card custom-card">
                <div className="card-body text-center">
                  <h5 className="card-title text-muted">Image Classification</h5>
                  <a href="#" type="button" className="btn-floating button-custom">
                    <i className="fa fa-camera" aria-hidden="false"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;