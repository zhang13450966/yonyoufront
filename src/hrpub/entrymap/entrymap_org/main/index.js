import React from 'react';
import {start, connect} from '../../../../hrpub/common/frame';
import MainPage from '../../entrymap_group/container/index.js'
import model from '../../entrymap_group/model/model.js'
import {handleHash} from 'src/hrpub/common/utils/utils'
const HomePageWithModel = handleHash('201981516135101', 'c=60025010&p=6008A005p')(connect(MainPage));

start({
    root: document.getElementById('app'),
    component: <HomePageWithModel/>,
    model: [model]
})