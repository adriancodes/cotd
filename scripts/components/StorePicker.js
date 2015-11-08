import React from 'react';
import {History} from 'react-router';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import h from '../helpers';

class StorePicker extends React.Component {
    @autobind
    goToStore(e) {
        e.preventDefault();
        let storeId = this.refs.storeId.value;
        this.history.pushState(null, '/store/' + storeId);
    }
    render() {
        var name = "adrian"
        return (
            <form className="store-selector" onSubmit={this.goToStore}>
                <h2>Please enter a store {name}</h2>
                <input type="text" ref="storeId" defaultValue={h.getFunName()}/>
                <input type="Submit"  />
            </form>
        )
    }
}

reactMixin.onClass(StorePicker, History);
export default StorePicker;