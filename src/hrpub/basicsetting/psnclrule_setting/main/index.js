import React from 'react'

import {start, connect}  from 'src/hrpub/common/frame/index'
import Model from '../model/model.js'
import MainPage from '../container/index'
import {handleHash} from 'src/hrpub/common/utils/utils'

const Wrapper = handleHash('201981519','/ifr?page=201981519&c=600230A0&p=60023090p')(connect(MainPage))
start({
    root: document.getElementById('app'),
    component: <Wrapper/>,
    model: [Model]
})