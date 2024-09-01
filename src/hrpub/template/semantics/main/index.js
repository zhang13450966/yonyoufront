import React from 'react';
import ReactDom from 'react-dom';

import HomePage from './salary.js';
import MainPage from './main';
import Manager from './manage-department';
import Social from './social-insurance';

ReactDom.render(<Manager />, document.getElementById('app'));