import React, {Component} from 'react';
import {start, connect} from 'src/hrpub/common/frame';
import HomePage from '../container';
import model from '../model/index';
import {handleHash } from 'src/hrpub/common/utils/utils.js'
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
const Wrapper = handleHash('2021', 'c=18209030&p=18209030p')(connect(HomePage));
// const Wrapper = connect(BudgetScope);
class Home extends Component {
    constructor(props) {
        super(props);
        this.appConfig = getAppPageConfig()
    }

    render() {
        return (
            <Wrapper 
                {...this.props}
                appConfig = {this.appConfig}
                nodeType = {'glb'}
                // ref={ref => model.data.pageIns = ref}
            />
        )
    }
}
start({
    root: document.getElementById('app'),
    component: <Home />,
    model: [model]
}); 