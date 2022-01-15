import React from 'react';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  const handleClick = () => {
    fetch('/api')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={handleClick}>Hit API</button>
      </header>
    </div>
  );
}

export default App;
