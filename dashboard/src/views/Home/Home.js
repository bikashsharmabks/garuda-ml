import React, { Component } from 'react';
import superagent from 'superagent';
import Dropzone from 'react-dropzone';
import GenderButton from '../../components/GenderButton/GenderButton'
import SentimentButton from '../../components/SentimentButton/SentimentButton'
import CardButton from '../../components/CardButton/CardButton'

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
    superagent.post('http://10.0.1.95:10001/api/predictions/gender')
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
    superagent.post('http://10.0.1.95:10002/api/predictions/card-detection')
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
              <SentimentButton handleTextClick={this.handleTextClick.bind(this)} />
              <CardButton handleImageClick={this.handleImageClick.bind(this)} />
            </div>
          </div>
        </div>
        <div className="container custom-text-container">
          <div className="row">
            <div className="col-sm-12" style={{'padding':0}}>
              {this.state.formName === "gender classification" ?
                (<form onSubmit={this.getGender}>
                  <h4 style={{ "color": "dimgray" }}>GENDER CLASSIFICATION</h4>
                  <p className="custom-description">Gender classification determines a person's gender, e.g., male or female, based on his or her name.</p>
                  <input className="custom-text" type="text" placeholder="Enter a name" value={this.state.value} onChange={this.handleChange} />
                  <input className="custom-button-evaluate" type="submit" value="Evaluate" />
                </form>) : ""}

              {this.state.formName === "text classification" ?
                (<form onSubmit={this.getTopic}>
                  <h4 style={{ "color": "dimgray" }}>SENTIMENT ANALYSIS</h4>
                  <p className="custom-description">Classifies the polarity of a given text, sentence or expressed opinion, as positive, negative, or neutral.</p>
                  <input className="custom-text" type="text" placeholder="Enter some text" value={this.state.value} onChange={this.handleChange} />
                  <input className="custom-button-evaluate" type="submit" value="Evaluate" />
                </form>) : ""}

              {this.state.formName === "image classification" ?
                (<div>
                  <h4 style={{ "color": "dimgray" }}>CARD DETECTION</h4>
                  <p className="custom-description">Detects the presence of any card in image and classifies the type of card, e.g. driving license or financial card (credit/debit).</p>
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
                      (<div style={{'font-size': '18px'}}>
                        {this.state.genderInfo[0].name.charAt(0).toUpperCase()+ this.state.genderInfo[0].name.slice(1)} is {this.state.genderInfo[0].gender} &nbsp; <i className="fa fa-mars fa-2x"  aria-hidden="false"></i>
                          &nbsp; with a <b>{this.state.genderInfo[0].probability}</b> probability. </div>) :
                      (<div style={{'font-size': '18px'}}>
                        {this.state.genderInfo[0].name.charAt(0).toUpperCase()+ this.state.genderInfo[0].name.slice(1)} is {this.state.genderInfo[0].gender} <i className="fa fa-venus fa-2x" aria-hidden="false"></i>
                          &nbsp; with a <b>{this.state.genderInfo[0].probability}</b> probability. </div>)
                      }
                    <div className="col-sm-12 gender-result">
                    <h5 style={{ "color": "dimgray" }}>JSON OUTPUT </h5>
                    <p className="custom-json">{JSON.stringify(this.state.genderInfo[0])}</p>
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
                    <div style={{'padding-top': '1%', 'font-size': '18px'}}>
                    <b>{this.state.imageInfo[0].type.charAt(0).toUpperCase()+ this.state.imageInfo[0].type.slice(1)}</b> with a <b>{this.state.imageInfo[0].probability}</b> probability.
                    </div>
                  </div>
                  <div className="col-sm-12 gender-result">
                    <h5 style={{ "color": "dimgray" }}>JSON OUTPUT </h5>
                    <p className="custom-json">{JSON.stringify(this.state.imageInfo[0])}</p>
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