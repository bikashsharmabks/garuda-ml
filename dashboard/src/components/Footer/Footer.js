import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="app-footer">
        <div className="row custom-footer">
          <i>As Michelangelo said, "I'm still learning.", we are too. P10 Labs is under it's learning and testing phase.
          <i className="fa fa-smile-o" aria-hidden="false"></i>
          </i>
        </div>
        <a href="hhttps://www.people10.com">People10</a> &copy; 2018 P10 Labs.
        <span className="float-right">Powered by <a href="https://www.people10.com">People10 Technologies</a></span>
      </footer>
    )
  }
}

export default Footer;
