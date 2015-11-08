import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router'
import { createHistory } from 'history';

var Rebase = require('re-base');
var h = require('./helpers');
var base = Rebase.createClass('https://amartin-cotd.firebaseio.com/')


import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import App from './components/App'






var routes = (
    <Router history={createHistory()}>
        <Route path="/" component={StorePicker}/>
        <Route path="/store/:storeId" component={App}/>
        <Router path="*" component={NotFound}/>
    </Router>
    )


ReactDOM.render(routes, document.querySelector("#main"));
