
import React from 'react';

import {start, connect} from '../../../../hrpub/common/store/index';
import { handleHash } from 'src/hrpub/common/utils/utils'

import HomePage from '../container';


import model from '../models/model';

const HomePageWithData = handleHash('20191205151400', 'c=60656010&p=60656010nccloud')(connect(HomePage));


start({
    root: document.getElementById('app'),
    component: <HomePageWithData/>,
    model: model
});
