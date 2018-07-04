import React, { Component } from 'react';
//import { Link } from 'react-router';
//import superagent from 'superagent';
//import moment from 'moment';

// <div class="btn-group hidden-sm-down hidden-md-down" role="group" aria-label="Card buttons">
//                       <a href="#" class="card-link" >Try this API</a>
//                     </div>

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hashtags: [],
		};
	}

	componentDidMount() {
		this.getHashtags();
	}

	// getHashtags() {
	// 	superagent.get('/api/hashtags')
	// 		.set('Accept', 'application/json')
	// 		.end((error, response) => {
	// 			if (error) {
	// 				console.log(error)
	// 			} else {
	// 				this.setState({
	// 					hashtags: response.body
	// 				});
	// 			}
	// 		});
	// }

  render() {

  	return (
    
	  	<div className="container">

        	<div className="row justify-content-md-center">
          		<div className="card hashtags">
            		<div className="card-body p-1">
              			<h4 className="card-title brand-success">Gender Classification</h4>
                    <div className="button" onclick="addTextBox()">
                        Try this API
                    </div>
          			</div>
          		</div>
          </div>

        <div className="row justify-content-center">  
            API 2
        </div>
      </div>
    
	  )
  }
}





export default Home;