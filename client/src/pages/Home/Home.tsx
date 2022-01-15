import React from 'react';

const Home = () => {
  const handleClick = () => {
    fetch('/api')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Home
        </p>
        <button className="btn btn-primary" data-testid='hit-api' onClick={handleClick}>Hit API</button>
      </header>
    </div>
  )
}

export default Home;
