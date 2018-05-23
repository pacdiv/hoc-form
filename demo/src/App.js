import React, { Component } from 'react';
import Form from './Form';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Form
          onSubmit={values => alert(`The form is valid! 🎉\nThere are the values:\n${JSON.stringify(values)}`)}
        />
      </div>
    );
  }
}

export default App;
