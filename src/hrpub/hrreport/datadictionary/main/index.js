import React from 'react';
import {start, connect} from 'src/hrpub/common/frame';
import HomePage from '../container';
import model from '../model/index';
import {handleHash } from 'src/hrpub/common/utils/utils.js'
const Wrapper = handleHash('2021', 'c=18209010&p=18209010p')(connect(HomePage));
// const Wrapper = connect(BudgetScope);

start({
    root: document.getElementById('app'),
    component: <Wrapper />,
    model: [model]
}); 
