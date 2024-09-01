
import React from 'react';

import {start, connect} from '../../../../hrpub/common/store/index';
import { handleHash } from 'src/hrpub/common/utils/utils'

import HomePage from '../container';


import model from '../models/model';

const HomePageWithData = handleHash('2019916105952100', 'c=60656040&p=60656040nccloud')(connect(HomePage));

start({
    root: document.getElementById('app'),
    component: <HomePageWithData/>,
    model: model
});
