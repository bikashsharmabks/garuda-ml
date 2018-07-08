import React, {Component} from 'react';
// import { Link } from 'react-router'; import superagent from 'superagent';
// import moment from 'moment';
import superagent from 'superagent';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formName:'gender classification',
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleGenderClick = this.handleGenderClick.bind(this);
    this.handleTextClick = this.handleTextClick.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.getGender = this.getGender.bind(this);
    this.getTopic = this.getTopic.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  getGender(event) {
    console.log(this.state.value)
    superagent.get('api/predictions/gender')
      .send({ name: this.state.value})
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) {
          console.log(error)
        } else {
          let res = response.body;
          console.log(res)
        }
      });
  }

  getTopic(event){

  }

  handleGenderClick(){
    this.setState({
      formName :'gender classification'
    });
  }

  handleTextClick(){
    this.setState({
      formName :'text classification'
    });
  }

  handleImageClick(){
    this.setState({
      formName :'image classification'
    });
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
                    <button type="button" className="btn btn-primary btn-primary-custom" onClick={this.handleGenderClick}>Try this API</button>
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
                    <button type="button" className="btn btn-primary btn-primary-custom" onClick={this.handleTextClick}>Try this API</button>
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
                    <button type="button" className="btn btn-primary btn-primary-custom" onClick={this.handleImageClick}>Try this API</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container text-center text-container">
          <div className="row">
            <div className="col-sm-12">
              {this.state.formName === "gender classification" ?
              (<form onSubmit={this.getGender}>
                <h2 style={{"color": "dimgray"}}>Gender Classification </h2>
                <label></label>
                <input className="custom-text text-center" type="text" placeholder="Enter a name" value={this.state.value} onChange={this.handleChange}/>
                <input type="submit" value="Go" />
              </form>) : ""}
              {this.state.formName === "text classification" ?
              (<form onSubmit={this.getTopic}>
                <h2 style={{"color": "dimgray"}}>Gender Classification </h2>
                <label></label>
                <input className="custom-text text-center" type="text" placeholder="Enter a name" value={this.state.value} onChange={this.handleChange}/>
                <input type="submit" value="Go" />
              </form>) : ""}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;