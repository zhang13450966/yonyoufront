import React, {Component} from 'react';
import {start, connect} from '../../../common/store';
import model from '../store/model';

import Container from '../container';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container 
                {...this.props}
                ref={ref => model.data.pageIns = ref}
            />
        )
    }
}

let Wrapper = connect(Home);

start({
    root: document.getElementById('app'),
    component: <Wrapper />,
    model: model
});