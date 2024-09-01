

import React, {Component} from 'react';




class BaseComponent extends Component {
    constructor(props) {
        super(props);

        this.loadActions = this.loadActions.bind(this);
    }

    

    loadActions() {
        if(this.action === undefined) {
            this.action = {};
        }
        Object.keys(this.actions).forEach((key) => {
            this.action[key] = new this.actions[key](this);
        });
    }
}

export default BaseComponent;