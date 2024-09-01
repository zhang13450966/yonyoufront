import React from 'react';

import {start, connect} from '../../../../hrpub/common/frame';

import HomePage from '../container';
import model from '../model/model';

const Wrapper = connect(HomePage);

start({
    root: document.getElementById('app'),
    component: <Wrapper />,
    model: [model]
});