import React from 'react';

import {start, connect} from '../../../../hrpub/common/frame';
import MainPage from '../container/index.js'
import model from '../model/model.js'
import {handleHash} from 'src/hrpub/common/utils/utils'
const HomePageWithModel = handleHash('2019815105156114', 'c=60024010&p=60089005p')(connect(MainPage));

start({
    root: document.getElementById('app'),
    component: <HomePageWithModel/>,
    model: [model]
})