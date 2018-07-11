import React, { Component } from 'react';

class SentimentButton extends Component {

  render() {
    return (
        <div className="col-sm-4 col-12" style={{'height':'300px'}}>
        <div className="card custom-card">
          <div className="card-body text-center">
            <h5 className="card-title custom-card-title">Sentiment Analysis</h5>
            <button type="button" className="btn-floating button-floating-custom">
              <i className="fa fa-smile-o custom-icon" aria-hidden="false"></i>
            </button>
          </div>
          <div className="text-center">
            <button type="button" className="btn btn-primary btn-primary-custom" onClick={this.props.handleTextClick}>Try this API</button>
          </div>
        </div>
      </div>
    )
  }
}

export default SentimentButton;
