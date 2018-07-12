import React, { Component } from 'react';
import superagent from 'superagent';
import Dropzone from 'react-dropzone';
import GenderButton from '../../components/GenderButton/GenderButton';
import SentimentButton from '../../components/SentimentButton/SentimentButton';
import CardButton from '../../components/CardButton/CardButton';
import ReactGA from 'react-ga';


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
      sentimentResult : false
    };
    this.handleChange = this.handleChange.bind(this);
    this.getGender = this.getGender.bind(this);
    this.getSentiment = this.getSentiment.bind(this);
    this.trackUsage = this.trackUsage.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  trackUsage(category, action) {
    ReactGA.event({
      category: category,
      action: action,
    });
  }
  

  getGender(event) {
    this.trackUsage('Gender Classification', 'gender click');
    superagent.post('api/gender-classification/predict')
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
        }
      });
  }

  onImageDrop(files) {
    this.trackUsage('Card detection', 'card click');
    superagent.post('api/card-detection/predict')
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


  getSentiment(event) {
    this.trackUsage('Sentiment Analysis', 'sentiment click');
    superagent.post('api/sentiment-analysis/predict')
    .send({ text: this.state.value })
      .end((error, response) => {
        if (error) {
          console.log(error)
        } else {
          let res = response.body;
          console.log(res)
          let sentimentInfo = [];
          sentimentInfo.push({
            polarity: res.polarity,
            sentiment: res.sentiment,
            text: this.state.value
          });
          this.setState({
            sentimentResult: true,
            sentimentInfo: sentimentInfo,
            value: ""
          });
        }
      });
  }

  handleGenderClick() {
    this.setState({
      formName: 'gender classification',
      imageResult: false,
      genderResult: false,
      sentimentResult: false
    });
  }

  handleTextClick() {
    this.setState({
      formName: 'sentiment-analysis',
      imageResult: false,
      genderResult: false,
      sentimentResult: false
    });
  }

  handleImageClick() {
    this.setState({
      formName: 'image classification',
      imageResult: false,
      genderResult: false,
      sentimentResult: false
    });
  }

  componentDidMount() { }

  render() {
    return (
      <div>
        <div className="row mt-2 banner-text">
          <div className="col-sm-8 col-lg-6">
            <div className="h3">Easy to integrate AI services</div>
          </div>
        </div>

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
            <div className="col-sm-12" style={{ 'padding': 0 }}>
              {this.state.formName === "gender classification" ?
                (<form onSubmit={this.getGender}>
                  <h4>GENDER CLASSIFICATION</h4>
                  <p className="custom-description">Gender classification determines a person's gender, e.g., male or female, based on his or her name.</p>
                  <input className="custom-text" type="text" placeholder="Enter a name" value={this.state.value} onChange={this.handleChange} />
                  <input className="custom-button-evaluate" type="submit" value="Evaluate" />
                </form>) : ""}

              {this.state.formName === "sentiment-analysis" ?
                (<form onSubmit={this.getSentiment}>
                  <h4>SENTIMENT ANALYSIS</h4>
                  <p className="custom-description">Classifies the polarity of a given text, sentence or expressed opinion, as positive, negative, or neutral.</p>
                  <input className="custom-text" type="text" placeholder="Enter some text" value={this.state.value} onChange={this.handleChange} />
                  <input className="custom-button-evaluate" type="submit" value="Evaluate" />
                </form>) : ""}

              {this.state.formName === "image classification" ?
                (<div>
                  <h4>CARD DETECTION</h4>
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
                    <h5>RESULT </h5>
                    {this.state.genderInfo[0].gender === 'male' ?
                      (<div style={{ 'font-size': '15px' }}>
                        <i>{this.state.genderInfo[0].name.charAt(0).toUpperCase() + this.state.genderInfo[0].name.slice(1)}</i> is <b>{this.state.genderInfo[0].gender}</b> &nbsp; <i className="fa fa-male fa-2x" aria-hidden="false" style={{ 'color': '#2072d8' }}></i>
                        &nbsp; with a <b>{this.state.genderInfo[0].probability}</b> probability. </div>) :
                      (<div style={{ 'font-size': '15px' }}>
                        <i>{this.state.genderInfo[0].name.charAt(0).toUpperCase() + this.state.genderInfo[0].name.slice(1)}</i> is <b>{this.state.genderInfo[0].gender}</b> <i className="fa fa-female fa-2x" aria-hidden="false" style={{ 'color': 'pink' }}></i>
                        &nbsp; with a <b>{this.state.genderInfo[0].probability}</b> probability. </div>)
                    }
                    <div className="row">
                      <div className="col-sm-12 text-muted" style={{
                        'font-size': '13px',
                        'padding-top': '10px'
                      }}>
                        Do you find it accurate enough? &nbsp; <i className="fa fa-thumbs-o-up fa-2x custom-thumb" aria-hidden="true"></i> &nbsp; &nbsp; <i className="fa fa-thumbs-o-down fa-2x custom-thumb"aria-hidden="true"></i>
                      </div>
                    </div>
                    <div className="col-sm-12 gender-result">
                      <h5>JSON OUTPUT </h5>
                      <p className="custom-json">{JSON.stringify(this.state.genderInfo[0])}</p>
                    </div>
                  </div>
                </div>
              </div>) : ""}

            {this.state.imageResult === true ?
              (<div className="container text-container">
                <div className="row">
                  <div className="col-sm-12 gender-result">
                    <h5>RESULT </h5>
                    <img src={this.state.imageFile.preview} style={{ 'max-width': '200px', 'max-height': '150px' }} alt="img.jpg"></img>
                    {this.state.imageInfo[0].type === 'driving license' ?
                      <div style={{ 'padding-top': '1%', 'font-size': '15px' }}>
                        <b>{this.state.imageInfo[0].type.charAt(0).toUpperCase() + this.state.imageInfo[0].type.slice(1)}</b> <i className="fa fa-credit-card fa-2x" style={{ 'color': 'gray' }} aria-hidden="false"></i> with a <b>{this.state.imageInfo[0].probability}</b> probability.
                    </div> : ""}
                    {this.state.imageInfo[0].type === 'financial card' ?
                      <div style={{ 'padding-top': '1%', 'font-size': '15px' }}>
                        <b>{this.state.imageInfo[0].type.charAt(0).toUpperCase() + this.state.imageInfo[0].type.slice(1)}</b> <i className="fa fa-credit-card fa-2x" style={{ 'color': 'gray' }} aria-hidden="false"></i> with a <b>{this.state.imageInfo[0].probability}</b> probability.
                    </div> : ""}
                    {this.state.imageInfo[0].type === 'text' ?
                      <div style={{ 'padding-top': '1%', 'font-size': '15px' }}>
                        <b>{this.state.imageInfo[0].type.charAt(0).toUpperCase() + this.state.imageInfo[0].type.slice(1)}</b> <i className="fa fa-file-text-o fa-2x" style={{ 'color': 'gray' }} aria-hidden="false"></i> with a <b>{this.state.imageInfo[0].probability}</b> probability.
                    </div> : ""}
                  </div>
                  <div className="row">
                      <div className="col-sm-12 text-muted" style={{
                        'font-size': '13px',
                        'padding-top': '3px'
                      }}>
                        Do you find it accurate enough? &nbsp; <i className="fa fa-thumbs-o-up fa-2x custom-thumb" aria-hidden="true"></i> &nbsp; &nbsp; <i className="fa fa-thumbs-o-down fa-2x custom-thumb" aria-hidden="true"></i>
                      </div>
                  </div>
                  <div className="col-sm-12 gender-result">
                    <h5>JSON OUTPUT </h5>
                    <p className="custom-json">{JSON.stringify(this.state.imageInfo[0])}</p>
                  </div>
                </div>
              </div>) : ""}

            {this.state.sentimentResult === true ?
              (<div className="container text-container">
                <div className="row">
                  <div className="col-sm-12 gender-result">
                    <h5>RESULT </h5>
                    {this.state.sentimentInfo[0].sentiment === 'positive' ?
                    <div style={{ 'padding-top': '1%', 'font-size': '15px' }}>
                      The given text <q><i>{this.state.sentimentInfo[0].text}</i></q> is <b>{this.state.sentimentInfo[0].sentiment}</b> <i className="fa fa-smile-o fa-2x" style={{'color': 'forestgreen'}}aria-hidden="false"></i> with a polarity of <b>{this.state.sentimentInfo[0].polarity}</b>.
                    </div> : ""}
                    {this.state.sentimentInfo[0].sentiment === 'negative' ?
                    <div style={{ 'padding-top': '1%', 'font-size': '15px' }}>
                      The given text <q><i>{this.state.sentimentInfo[0].text}</i></q> is <b>{this.state.sentimentInfo[0].sentiment}</b> <i className="fa fa-frown-o fa-2x" style={{'color': 'deeppink'}}aria-hidden="false"></i> with a polarity of <b>{this.state.sentimentInfo[0].polarity}</b>.
                    </div> : ""}
                    {this.state.sentimentInfo[0].sentiment === 'neutral' ?
                    <div style={{ 'padding-top': '1%', 'font-size': '15px' }}>
                      The given text <q><i>{this.state.sentimentInfo[0].text}</i></q> is <b>{this.state.sentimentInfo[0].sentiment}</b> <i className="fa fa-meh-o fa-2x" style={{'color': 'orange'}}aria-hidden="false"></i> with a polarity of <b>{this.state.sentimentInfo[0].polarity}</b>.
                    </div> : ""}
                  </div>
                  <div className="row">
                      <div className="col-sm-12 text-muted" style={{
                        'font-size': '13px',
                        'padding-top': '3px'
                      }}>
                        Do you find it accurate enough? &nbsp; <i className="fa fa-thumbs-o-up fa-2x custom-thumb" aria-hidden="true"></i> &nbsp; &nbsp; <i className="fa fa-thumbs-o-down fa-2x" style={{'color':'cornflowerblue'}}aria-hidden="true"></i>
                      </div>
                    </div>
                  <div className="col-sm-12 gender-result">
                    <h5>JSON OUTPUT </h5>
                    <p className="custom-json">{JSON.stringify(this.state.sentimentInfo[0])}</p>
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