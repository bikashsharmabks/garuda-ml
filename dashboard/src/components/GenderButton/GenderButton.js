import React, { Component } from 'react';

class GenderButton extends Component {

  render() {
    return (
      <div className="col-sm-4 col-12" style={{'height':'300px'}}>
        <div className="card custom-card">
          <div className="card-body text-center">
            <h5 className="card-title custom-card-title">Gender Classification</h5>
            <button type="button" className="btn-floating button-floating-custom">
              <i className="fa fa-venus-mars custom-icon" aria-hidden="false"></i>
            </button>
          </div>
          <div className="text-center">
            <button type="button" className="btn btn-primary btn-primary-custom" onClick={this.props.handleGenderClick}>Try this API</button>
          </div>
        </div>
      </div>
    )
  }
}

export default GenderButton;
