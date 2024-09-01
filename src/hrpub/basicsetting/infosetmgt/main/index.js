import React from 'react';
import { start, connect } from 'src/hrpub/common/frame';
import HomePage from '../container';
import model from '../model/model';
import { handleHash } from 'src/hrpub/common/utils/utils';
const Wrapper = handleHash('201908281426', 'c=60023010&p=60023010nccloud')(connect(HomePage));
start({
	root: document.getElementById('app'),
	component: <Wrapper />,
	model: [ model ]
});
