import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Results from './pages/Results';
import Navigation from './components/Navigation';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/upload" component={Upload} />
        <Route path="/results" component={Results} />
      </Switch>
    </Router>
  );
};

export default App;