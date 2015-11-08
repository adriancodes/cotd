var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');


var Rebase = require('re-base');
var base = Rebase.createClass(process.env.database)

var h = require('./helpers');

var App = React.createClass({
    getInitialState: function() {
        return {
            fishes: {},
            order: {}
        }
    },
    componentDidMount: function() {
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
    },
    componentWillUpdate: function(nextProps, nextState) {
        localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
    },
    addToOrder: function(key){
        this.state.order[key] = this.state.order[key] + 1 || 1;
        this.setState({order: this.state.order})
    },
    addFish: function(fish) {
        var timestamp = (new Date()).getTime();
        this.state.fishes['fish-'+timestamp] = fish;
        this.setState({fishes: this.state.fishes});
    },
    loadSamples: function() {
        this.setState({
                fishes: require('./sample-fishes')
            });
    },
    renderFish: function(key) {
        return (
            <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>            )
    },
    render: function() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishing">
                        {Object.keys(this.state.fishes).map(this.renderFish)}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order}/>
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
            </div>
        )
    }
});

var Fish = React.createClass({
    onButtonClick: function() {
        this.props.addToOrder(this.props.index);
    },
    render: function() {
        var details = this.props.details;
        var isAvailable = (details.status === 'available' ? true : false);
        var buttonText = (isAvailable ? "Add To Order" : "Sold Out!")
        return (
            <li className="menu-fish">
                <img src={this.props.details.image} alt={details.name}/>
                <h3 className="fish-name">{details.name}
                <span className="price">{h.formatPrice(details.price)}</span></h3>
                <p>{details.desc}</p>
                <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
            </li>
        )
    }
})

var AddFishForm = React.createClass({
    createFish: function(e) {
        e.preventDefault();
        var fish = {
            name: this.refs.name.value,
            price: this.refs.price.value,
            status: this.refs.status.value,
            desc: this.refs.desc.value,
            image: this.refs.image.value
        };

        this.props.addFish(fish);
        this.refs.fishForm.reset();

    },
    render:function() {
        return (
           <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
               <input type="text" ref="name" placeholder="Fish Name"/>
               <input type="text" ref="price" placeholder="Fish Price"/>
               <select ref="status">
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
               </select>
                <textarea type="text" ref="desc" placeholder="Desc"></textarea>
                <input type="text" ref="image" placeholder="Url To Change"/>
                <button type="submit">+ Add Item</button>
           </form>
        )
    }
});

var Header = React.createClass({
    render: function() {
        return (
            <header className="top">
                <h1>Catch
                    <span className="ofThe">
                        <span className="of">of</span>
                        <span className="the">the</span>
                    </span>
                    day</h1>
                <h3 className="tagline">
                    <span>
                        {this.props.tagline}
                    </span>
                </h3>
            </header>
        )
    }
});

var Order = React.createClass({
    renderOrder: function(key){
        var fish = this.props.fishes[key];
        var count = this.props.order[key];

        if (!fish){
            return <li key={key}> Sorry, fish is no longer available</li>
        }

        return (
            <li key={key}>
                {count}lbs
                {fish.name}
                <span className="price">{h.formatPrice(count * fish.price)}</span>
            </li>
        )
    },
    render: function() {
        var orderIds = Object.keys(this.props.order);
        var total = orderIds.reduce((prevTotal, key) => {
            var fish = this.props.fishes[key];
            var count = this.props.order[key];
            var isAvailable = fish && fish.status === 'available';
            if (isAvailable) {
                return prevTotal + (count * parseInt(fish.price) || 0);
            }

            return prevTotal;
        }, 0);
        return (
            <div className="order-wrap">
                <h2 className="order-title">Your Order</h2>
                <ul className="order">
                    {orderIds.map(this.renderOrder)}
                    <li className="total">
                        <strong>Total:</strong>
                        {h.formatPrice(total)}
                    </li>
                </ul>
            </div>
        )
    }
});

var Inventory = React.createClass({
    render: function() {
        return (
            <div>
                <h2>Inventory</h2>
                <AddFishForm {...this.props} />
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>

        )
    }
});

var StorePicker = React.createClass({
    mixins:[History],
    goToStore: function(e) {
        e.preventDefault();
        let storeId = this.refs.storeId.value;
        this.history.pushState(null, '/store/' + storeId);
    },
    render: function() {
        var name = "adrian"
        return (
            <form className="store-selector" onSubmit={this.goToStore}>
                <h2>Please enter a store {name}</h2>
                <input type="text" ref="storeId" defaultValue={h.getFunName()}/>
                <input type="Submit"  />
            </form>
        )
    }
});

var NotFound = React.createClass({
    render: function() {
        return (
            <h1>Not Found!</h1>
        )
    }
})

var routes = (
    <Router history={createBrowserHistory()}>
        <Route path="/" component={StorePicker}/>
        <Route path="/store/:storeId" component={App}/>
        <Router path="*" component={NotFound}/>
    </Router>
    )


ReactDOM.render(routes, document.querySelector("#main"));