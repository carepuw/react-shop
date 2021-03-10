import React from 'react';
import { Route } from 'react-router-dom'

import Header from './components/Header';

import Home from './pages/Home';
import PostComponent from './pages/Post';
import Profile from './pages/Profile';
import CreateAuction from './pages/CreateAuction';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  return (
    <div>
      <Header />

      <Route path="/post/:id" component={PostComponent} exact />
      <Route path="/" component={Home} exact />
      <Route path="/profile" component={Profile} exact />
      <Route path="/create-auction" component={CreateAuction} exact />

    </div>
  );
}

export default App;
