import React, {Component} from 'react';
import {start, connect} from 'src/hrpub/common/frame';
import HomePage from '../../reportstatisticsconditions-glp/container';
import model from '../../reportstatisticsconditions-glp/model/index';
import {handleHash } from 'src/hrpub/common/utils/utils.js'
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
const Wrapper = handleHash('2021', 'c=18209031&p=18209031p')(connect(HomePage));
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
                nodeType = {'group'}
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