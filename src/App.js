import React from 'react';
import GameLikePersonalWebsite from './GameLikePersonalWebsite';
import './App.css'; // Make sure to import the CSS file

function App() {
  console.log("App component is rendering");
  return (
    <div className="App">
      <GameLikePersonalWebsite />
    </div>
  );
}

export default App;