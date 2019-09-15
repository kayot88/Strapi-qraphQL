import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from './components/App';
import Checkout from './components/Checkout';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Brews from './components/Brews';
import Navbar from './components/Navbar';

import 'gestalt/dist/gestalt.css';
import registerServiceWorker from './registerServiceWorker';

const Root = () => (
  <Fragment>
    <Router>
      <Navbar>Signin</Navbar>
      <Switch>
        <Route component={App} exact path="/" />
        <Route component={Checkout} path="/checkout" />
        <Route component={Signin} path="/signin" />
        <Route component={Signup} path="/signup" />
        <Route component={Brews} path="/:brandId" />
      </Switch>
    </Router>
  </Fragment>
);

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
