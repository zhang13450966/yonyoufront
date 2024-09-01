
import React from 'react';
import ReactDOM from 'react-dom';
import { createPage, base } from 'nc-lightapp-front';
import { start, connect } from '../../../../hrpub/common/store/index';
import { handleHash } from 'src/hrpub/common/utils/utils'

import model from '../models';
import HomePage from '../container';

const HomePageWithData = handleHash('20191018112211', 'c=60201040&p=60201040nccloud')(connect(createPage({})(HomePage)));

start({
    root: document.getElementById('app'),
    component: <HomePageWithData />,
    model: model
});
