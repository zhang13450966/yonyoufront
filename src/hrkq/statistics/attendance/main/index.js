
import React from 'react';
import ReactDOM from 'react-dom';
import { createPage, base } from 'nc-lightapp-front';
import { start, connect } from '../../../../hrpub/common/store/index';
import { handleHash } from 'src/hrpub/common/utils/utils'

import model from '../models';
import HomePage from '../container';

const HomePageWithData = handleHash('20191225161616', 'c=60201020&p=60201020nccloud')(connect(createPage({})(HomePage)));

start({
    root: document.getElementById('app'),
    component: <HomePageWithData />,
    model: model
});
