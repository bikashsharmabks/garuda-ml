import React, { Component } from 'react';
import './App.css';
import Home from './views/Home';

class App extends Component {
  render() {
    console.log(Home)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Dashboard</h1>
        </header>      
        <Home />
      </div>
    );
  }
}

export default App;
