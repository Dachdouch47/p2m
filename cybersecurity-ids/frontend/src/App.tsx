import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Monitoring from './pages/Monitoring';
import AlertHistory from './pages/AlertHistory';
import ThreatMap from './pages/ThreatMap';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './styles/index.css';
import './styles/pages.css';

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// Route protection HOC
const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        window.location.href = '/login'
      )
    }
  />
);

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/" exact component={Home} />
        <PrivateRoute path="/monitoring" component={Monitoring} />
        <PrivateRoute path="/alerts" component={AlertHistory} />
        <PrivateRoute path="/threats" component={ThreatMap} />
        <PrivateRoute path="/settings" component={Settings} />
        <Route path="/login" render={() => <Login onLogin={() => window.location.href = '/'} />} />
        <Route path="/signup" render={() => <Signup onSignup={() => window.location.href = '/'} />} />
      </Switch>
    </Router>
  );
};

export default App;