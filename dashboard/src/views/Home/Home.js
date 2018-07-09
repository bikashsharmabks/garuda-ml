import React, { Component } from 'react';
import superagent from 'superagent';
import Dropzone from 'react-dropzone';
import GenderButton from '../../components/GenderButton/GenderButton.js'
import TextButton from '../../components/TextButton/TextButton.js'
import ImageButton from '../../components/ImageButton/ImageButton.js'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formName: 'gender classification',
      value: "",
      genderResult: false,
      genderInfo: [],
      imageResult: false,
      imageFile: "",
      imageInfo: [],
      textResult : false
    };
    this.handleChange = this.handleChange.bind(this);
    this.getGender = this.getGender.bind(this);
    this.getTopic = this.getTopic.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  getGender(event) {
    superagent.post('http://localhost:10001/api/predictions/gender')
      .send({ name: this.state.value })
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) {
          console.log(error)
        } else {
          let res = response.body;
          let genderInfo = []
          genderInfo.push({
            name: res.name,
            gender: res.gender,
            probability: res.probability
          });
          this.setState({
            genderResult: true,
            genderInfo: genderInfo,
            value: ""
          });
          console.log(genderInfo)
        }
      });
  }

  onImageDrop(files) {
    superagent.post('http://localhost:10002/api/predictions/card-detection')
      .attach('file', files[0])
      .end((error, response) => {
        if (error) {
          console.log(error)
        } else {
          let res = response.body;
          let imageInfo = []
          imageInfo.push({
            type: res.predicted_card_type,
            probability: res.probability
          });
          this.setState({
            imageFile: files[0],
            imageResult: true,
            imageInfo: imageInfo
          });
        }
      });
  }


  getTopic(event) {
    this.setState({
      value: ""
    });
  }

  handleGenderClick() {
    this.setState({
      formName: 'gender classification',
      imageResult: false,
      genderResult: false,
      textResult: false
    });
  }

  handleTextClick() {
    this.setState({
      formName: 'text classification',
      imageResult: false,
      genderResult: false,
      textResult: false
    });
  }

  handleImageClick() {
    this.setState({
      formName: 'image classification',
      imageResult: false,
      genderResult: false,
      textResult: false
    });
  }

  componentDidMount() { }

  render() {
    return (
      <div>
        <div className="custom-container">
          <div className="container clearfix">
            <div className="row">
              <GenderButton handleGenderClick={this.handleGenderClick.bind(this)} />
              <TextButton handleTextClick={this.handleTextClick.bind(this)} />
              <ImageButton handleImageClick={this.handleImageClick.bind(this)} />
            </div>
          </div>
        </div>
        <div className="container custom-text-container">
          <div className="row">
            <div className="col-sm-12" style={{'padding':0}}>
              {this.state.formName === "gender classification" ?
                (<form onSubmit={this.getGender}>
                  <h4 style={{ "color": "dimgray" }}>GENDER CLASSIFICATION</h4>
                  <input className="custom-text" type="text" placeholder="Enter a name" value={this.state.value} onChange={this.handleChange} />
                  <input className="custom-button-evaluate" type="submit" value="Evaluate" />
                </form>) : ""}

              {this.state.formName === "text classification" ?
                (<form onSubmit={this.getTopic}>
                  <h4 style={{ "color": "dimgray" }}>TEXT CLASSIFICATION</h4>
                  <input className="custom-text" type="text" placeholder="Enter some text" value={this.state.value} onChange={this.handleChange} />
                  <input className="custom-button-evaluate" type="submit" value="Evaluate" />
                </form>) : ""}

              {this.state.formName === "image classification" ?
                (<div>
                  <h4 style={{ "color": "dimgray" }}>IMAGE CLASSIFICATION</h4>
                  <Dropzone className="custom-dropzone"
                    multiple={false}
                    accept="image/*"
                    onDrop={this.onImageDrop.bind(this)}>
                    <p>Drop an image or click to select a file to upload.</p>
                  </Dropzone>
                </div>) : ""}
            </div>

            {this.state.genderResult === true ?
              (<div className="container text-container">
                <div className="row">
                  <div className="col-sm-12 gender-result">
                    <h5 style={{ "color": "dimgray" }}>RESULT </h5>
                    {this.state.genderInfo[0].gender === 'male' ?
                      (<div>
                        {this.state.genderInfo[0].name} is {this.state.genderInfo[0].gender} <i className="fa fa-male custom_icon_mf"  aria-hidden="false"></i>
                          &nbsp; with a {this.state.genderInfo[0].probability} probability. </div>) :
                      (<div>
                        {this.state.genderInfo[0].name} is {this.state.genderInfo[0].gender} <i className="fa fa-female custom_icon_mf" aria-hidden="false"></i>
                          &nbsp; with a {this.state.genderInfo[0].probability} probability. </div>)
                      }
                    <div className="col-sm-12 gender-result">
                    <h5 style={{ "color": "dimgray" }}>JSON OUTPUT </h5>
                    {JSON.stringify(this.state.genderInfo[0])}
                  </div>
                </div>
                </div>
              </div>) : ""}

            {this.state.imageResult === true ?
              (<div className="container text-container">
                <div className="row">
                  <div className="col-sm-12 gender-result">
                    <h5 style={{ "color": "dimgray" }}>RESULT </h5>
                    <img src={this.state.imageFile.preview} style={{'max-width':'200px', 'max-height': '150px'}} alt="img.jpg"></img>
                    <div>
                      {this.state.imageInfo[0].type} with a {this.state.imageInfo[0].probability} probability.
                    </div>
                  </div>
                  <div className="col-sm-12 gender-result">
                    <h5 style={{ "color": "dimgray" }}>JSON OUTPUT </h5>
                    {JSON.stringify(this.state.imageInfo[0])}
                  </div>
                </div>
              </div>) : ""}

          </div>
        </div>
      </div>
    )
  }
}

export default Home;