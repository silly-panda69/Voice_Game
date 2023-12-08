import React from 'react';
import {Route,Routes,BrowserRouter as Router} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GamePage/>}></Route>
        {/* <Route path='/room/:roomId' element={<GamePage/>}></Route> */}
      </Routes>
    </Router>
  );
}

export default App;
