import React from 'react';

import {start, connect} from '../../../../hrpub/common/frame';

import HomePage from '../container';
import model from '../model/model';
import { handleHash } from 'src/hrpub/common/utils/utils'
const Wrapper = handleHash('201910116420104', 'c=60656041&p=60656041nccloud')(connect(HomePage));

start({
    root: document.getElementById('app'),
    component: <Wrapper />,
    model: [model]
});