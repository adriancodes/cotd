import React from 'react';
import ReactDOM from 'react-dom';
import ReactRouter from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Catalyst from 'react-catalyst';
import Rebase from 're-base';
import h from '../helpers';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';


var base = Rebase.createClass(database)
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;

import Fish from './Fish';
import Order from './Order';
import Inventory from './Inventory'
import Header from './Header'



class App extends React.Component {

    constructor() {
        super();
        this.state = {
            fishes: {},
            order: {}
        }
    }

    componentDidMount() {
        base.syncState(this.props.params.storeId + "/fishes", {
            context: this,
            state: 'fishes'
        });

        var localStorageRef = localStorage.getItem('order-'+ this.props.params.storeId);

        if (localStorageRef) {
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
    }

    @autobind
    addToOrder(key){
        this.state.order[key] = this.state.order[key] + 1 || 1;
        this.setState({order: this.state.order})
    }

    @autobind
    addFish(fish) {
        var timestamp = (new Date()).getTime();
        this.state.fishes['fish-'+timestamp] = fish;
        this.setState({fishes: this.state.fishes});
    }

    @autobind
    removeFromOrder(key) {
            delete this.state.order[key]
            this.setState({
                order: this.state.order
            });
    }

    @autobind
    removeFish(key){
        if (confirm("Are you sure you want to remove this fish?")) {
            this.state.fishes[key] = null;
            this.setState({
                fishes: this.state.fishes
            });
        }
    }

    @autobind
    loadSamples() {
        this.setState({
                fishes: require('../sample-fishes')
            });
    }

    @autobind
    renderFish(key) {
        return (
            <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>            )
    }

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishing">
                        {Object.keys(this.state.fishes).map(this.renderFish)}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder}/>
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples}
                fishes={this.state.fishes} linkState={this.linkState.bind(this)} removeFish={this.removeFish}/>
            </div>
        )
    }
}

reactMixin.onClass(App, Catalyst.LinkedStateMixin);
export default App;