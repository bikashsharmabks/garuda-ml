import React, { Component } from 'react';

class CardButton extends Component {

    render() {
        return (
            <div className="col-sm-4">
                <div className="card custom-card">
                    <div className="card-body text-center">
                        <h5 className="card-title custom-card-title">Card<br />Detection</h5>
                        <button type="button" className="btn-floating button-floating-custom">
                            <i className="fa fa-credit-card custom-icon" aria-hidden="false"></i>
                        </button>
                    </div>
                    <div className="text-center">
                        <button type="button" className="btn btn-primary btn-primary-custom" onClick={this.props.handleImageClick}>Try this API</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default CardButton;
