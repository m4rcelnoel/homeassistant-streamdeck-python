import * as React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from './layouts/Layout';
import Home from './pages/Home';

function App() {

  return (
    <div className='App'>
      <Router>
        <Layout/>
        <Routes>
          <Route exact path="/" element={<Home/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
