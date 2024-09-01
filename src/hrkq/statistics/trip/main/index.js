
import React from 'react';
import ReactDOM from 'react-dom';
import { createPage, base } from 'nc-lightapp-front';
import { start, connect } from '../../../../hrpub/common/store/index';
import { handleHash } from 'src/hrpub/common/utils/utils'

import model from '../models';
import HomePage from '../container';

// for debug
// import { handleHash } from '../../../../hrpub/common/utils/utils';
// const HomePageWithData = handleHash('201908281426', 'c=60201050&p=60201050p')(connect(createPage({})(HomePage)))

// else
const HomePageWithData = handleHash('20191018102211', 'c=60201050&p=60201050nccloud')(connect(createPage({})(HomePage)));

start({
    root: document.getElementById('app'),
    component: <HomePageWithData />,
    model: model
});
