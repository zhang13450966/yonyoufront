
import React from 'react';
import ReactDOM from 'react-dom';
import { createPage, base } from 'nc-lightapp-front';
import { start, connect } from '../../../../hrpub/common/store/index';
import { handleHash } from 'src/hrpub/common/utils/utils'

import model from '../models';
import HomePage from '../container';

const HomePageWithData = handleHash('2019101520420104', 'c=60201030&p=60201030nccloud')(connect(createPage({})(HomePage)));

start({
    root: document.getElementById('app'),
    component: <HomePageWithData />,
    model: model
});
