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
      sentimentResult : false,
      activeThumb: ""
    };
    this.trackUsage = this.trackUsage.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  trackUsage(category, action, label, value) {
    ReactGA.event({
      category: category,
      action: action,
      label: label, 
      value: value
    });
  }
  
  getGender(event) {
    
    var name = this.state.value;
    name = name.split(" ");
    superagent.post('api/gender-classification/predict')
      .send({ name: name[0] })
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
          this.trackUsage('Gender Classification', 'gender click', this.state.value, res.probability);
          this.setState({
            genderResult: true,
            genderInfo: genderInfo,
            value: ""
          });
        }
      });
  }

  onImageDrop(files) {
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
          this.trackUsage('Card detection', 'card click', "image", res.probability);
          this.setState({
            imageFile: files[0],
            imageResult: true,
            imageInfo: imageInfo
          });
        }
      });
  }


  getSentiment(event) {
    superagent.post('api/sentiment-analysis/predict')
    .send({ text: this.state.value })
      .end((error, response) => {
        if (error) {
          console.log(error)
        } else {
          let res = response.body;
          let sentimentInfo = [];
          sentimentInfo.push({
            polarity: res.polarity,
            sentiment: res.sentiment,
            text: this.state.value
          });
          this.trackUsage('Sentiment Analysis', 'sentiment click' , this.state.value, res.polarity);
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
      sentimentResult: false,
      activeThumb: ""
    });
  }

  handleTextClick() {
    this.setState({
      formName: 'sentiment-analysis',
      imageResult: false,
      genderResult: false,
      sentimentResult: false,
      activeThumb: ""
    });
  }

  handleImageClick() {
    this.setState({
      formName: 'image classification',
      imageResult: false,
      genderResult: false,
      sentimentResult: false,
      activeThumb: ""
    });
  }

  handleToggle(activeThumb) {
      this.setState({
        activeThumb: activeThumb
      })
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
              <CardButton handleImageClick={this.handleImageClick.bind(this)} />
              <SentimentButton handleTextClick={this.handleTextClick.bind(this)} />   
            </div>
          </div>
        </div>

        <div className="custom-text-container">
          <div className="row">
            <div className="col-sm-12 col-12">
              {this.state.formName === "gender classification" ?
                (<form onSubmit={this.getGender.bind(this)}>
                  <h4>GENDER CLASSIFICATION</h4>
                  <p className="custom-description">Gender classification determines a person's gender, e.g., male or female, based on his or her first name.</p>
                  <input className="custom-text" type="text" placeholder="Enter first name" value={this.state.value} onChange={this.handleChange.bind(this)} />
                  <input className="custom-button-evaluate" type="submit" value="Evaluate" />
                </form>) : ""}

              {this.state.formName === "sentiment-analysis" ?
                (<form onSubmit={this.getSentiment.bind(this)}>
                  <h4>SENTIMENT ANALYSIS</h4>
                  <p className="custom-description">Classifies the polarity of a given text, sentence or expressed opinion, as positive, negative, or neutral.</p>
                  <input className="custom-text" type="text" placeholder="Enter some text" value={this.state.value} onChange={this.handleChange.bind(this)} />
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
        </div>
          {this.state.genderResult === true ?
            (<div className="row">
              <div className="col-sm-12 col-12 result">
                <h5>RESULT </h5>
                {this.state.genderInfo[0].gender === 'male' ?
                  (<p style={{ 'fontSize': '15px' }}>
                    <i>{this.state.genderInfo[0].name.charAt(0).toUpperCase() + this.state.genderInfo[0].name.slice(1)}</i> is <b>{this.state.genderInfo[0].gender}</b> &nbsp; <i className="fa fa-male fa-2x" aria-hidden="false" style={{ 'color': '#2072d8' }}></i>
                    &nbsp; with a <b>{this.state.genderInfo[0].probability}</b> probability. </p>) :
                  (<p style={{ 'fontSize': '15px' }}>
                    <i>{this.state.genderInfo[0].name.charAt(0).toUpperCase() + this.state.genderInfo[0].name.slice(1)}</i> is <b>{this.state.genderInfo[0].gender}</b> <i className="fa fa-female fa-2x" aria-hidden="false" style={{ 'color': 'pink' }}></i>
                    &nbsp; with a <b>{this.state.genderInfo[0].probability}</b> probability. </p>)
                }
                <p className="text-muted" style={{
                  'fontSize': '13px',
                  'paddingTop': '10px'
                }}>
                  Did you find it accurate enough? &nbsp;
                        <a
                    onClick={this.handleToggle.bind(this, "thumbsUp")}
                    style={{ color: (this.state.activeThumb === 'thumbsUp' ? "cornflowerblue" : "gray") }}

                  ><i className="fa fa-thumbs-o-up fa-2x custom-thumb" aria-hidden="true"> </i>
                  </a> &nbsp; &nbsp;
                      <a
                    onClick={this.handleToggle.bind(this, "thumbsDown")}
                    style={{ color: (this.state.activeThumb === 'thumbsDown' ? "cornflowerblue" : "gray") }}
                  >
                    <i className="fa fa-thumbs-o-down fa-2x custom-thumb" aria-hidden="true"></i>
                  </a>
                </p>

                <div className="result">
                  <h5>JSON OUTPUT </h5>
                  <p className="custom-json">{JSON.stringify(this.state.genderInfo[0])}</p>
                </div>
              </div>
            </div>) : ""}
                      
            {this.state.imageResult === true ?
              (<div className="row">
                  <div className="col-sm-12 result">
                    <h5>RESULT </h5>
                    <img src={this.state.imageFile.preview} style={{ 'max-width': '200px', 'max-height': '150px' }} alt="img.jpg"></img>
                    {this.state.imageInfo[0].type === 'driving license' ?
                      <p style={{ 'paddingTop': '1%', 'fontSize': '15px' }}>
                        <b>{this.state.imageInfo[0].type.charAt(0).toUpperCase() + this.state.imageInfo[0].type.slice(1)}</b> <i className="fa fa-credit-card fa-2x" style={{ 'color': 'gray' }} aria-hidden="false"></i> with a <b>{this.state.imageInfo[0].probability}</b> probability.
                    </p> : ""}
                    {this.state.imageInfo[0].type === 'financial card' ?
                      <p style={{ 'paddingTop': '1%', 'fontSize': '15px' }}>
                        <b>{this.state.imageInfo[0].type.charAt(0).toUpperCase() + this.state.imageInfo[0].type.slice(1)}</b> <i className="fa fa-credit-card fa-2x" style={{ 'color': 'gray' }} aria-hidden="false"></i> with a <b>{this.state.imageInfo[0].probability}</b> probability.
                    </p> : ""}
                    {this.state.imageInfo[0].type === 'text' ?
                      <p style={{ 'paddingTop': '1%', 'fontSize': '15px' }}>
                        <b>{this.state.imageInfo[0].type.charAt(0).toUpperCase() + this.state.imageInfo[0].type.slice(1)}</b> <i className="fa fa-file-text-o fa-2x" style={{ 'color': 'gray' }} aria-hidden="false"></i> with a <b>{this.state.imageInfo[0].probability}</b> probability.
                    </p> : ""}
                  
                    <p className="text-muted" style={{
                        'fontSize': '13px',
                        'paddingTop': '10px'
                      }}>
                        Did you find it accurate enough? &nbsp;
                        <a
                          onClick={this.handleToggle.bind(this, "thumbsUp")}
                          style={{ color: (this.state.activeThumb === 'thumbsUp' ? "cornflowerblue" : "gray") }}

                        ><i className="fa fa-thumbs-o-up fa-2x custom-thumb" aria-hidden="true"> </i>
                        </a> &nbsp; &nbsp;
  
                      <a
                          onClick={this.handleToggle.bind(this, "thumbsDown")}
                          style={{ color: (this.state.activeThumb === 'thumbsDown' ? "cornflowerblue" : "gray") }}
                        >
                          <i className="fa fa-thumbs-o-down fa-2x custom-thumb" aria-hidden="true"></i>
                        </a>
                  </p>
                  <div className="result">
                    <h5>JSON OUTPUT </h5>
                    <p className="custom-json">{JSON.stringify(this.state.imageInfo[0])}</p>
                  </div>
                </div>
              </div>) : ""}

            {this.state.sentimentResult === true ?
              (<div className="row">
                  <div className="col-sm-12 result">
                    <h5>RESULT </h5>
                    {this.state.sentimentInfo[0].sentiment === 'positive' ?
                    <p style={{ 'paddingTop': '1%', 'fontSize': '15px' }}>
                      The given text <q><i>{this.state.sentimentInfo[0].text}</i></q> is <b>{this.state.sentimentInfo[0].sentiment}</b> <i className="fa fa-smile-o fa-2x" style={{'color': 'forestgreen'}}aria-hidden="false"></i> with a polarity of <b>{this.state.sentimentInfo[0].polarity}</b>.
                    </p> : ""}
                    {this.state.sentimentInfo[0].sentiment === 'negative' ?
                    <p style={{ 'paddingTop': '1%', 'fontSize': '15px' }}>
                      The given text <q><i>{this.state.sentimentInfo[0].text}</i></q> is <b>{this.state.sentimentInfo[0].sentiment}</b> <i className="fa fa-frown-o fa-2x" style={{'color': 'deeppink'}}aria-hidden="false"></i> with a polarity of <b>{this.state.sentimentInfo[0].polarity}</b>.
                    </p> : ""}
                    {this.state.sentimentInfo[0].sentiment === 'neutral' ?
                    <p style={{ 'paddingTop': '1%', 'fontSize': '15px' }}>
                      The given text <q><i>{this.state.sentimentInfo[0].text}</i></q> is <b>{this.state.sentimentInfo[0].sentiment}</b> <i className="fa fa-meh-o fa-2x" style={{'color': 'orange'}}aria-hidden="false"></i> with a polarity of <b>{this.state.sentimentInfo[0].polarity}</b>.
                    </p> : ""}
                  
                    <p className="text-muted" style={{
                        'fontSize': '13px',
                        'paddingTop': '10px'
                      }}>
                        Did you find it accurate enough? &nbsp;
                        <a
                          onClick={this.handleToggle.bind(this, "thumbsUp")}
                          style={{ color: (this.state.activeThumb === 'thumbsUp' ? "cornflowerblue" : "gray") }}

                        ><i className="fa fa-thumbs-o-up fa-2x custom-thumb" aria-hidden="true"> </i>
                        </a> &nbsp; &nbsp;
  
                        <a
                          onClick={this.handleToggle.bind(this, "thumbsDown")}
                          style={{ color: (this.state.activeThumb === 'thumbsDown' ? "cornflowerblue" : "gray") }}
                        >
                          <i className="fa fa-thumbs-o-down fa-2x custom-thumb" aria-hidden="true"></i>
                        </a>
                    </p>
                    <div className="result">
                    <h5>JSON OUTPUT </h5>
                    <p className="custom-json">{JSON.stringify(this.state.sentimentInfo[0])}</p>
                    </div>
                  </div> 
                </div>) : ""}
        </div>
      </div>
    )
  }
}

export default Home;