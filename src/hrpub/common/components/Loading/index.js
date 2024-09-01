
import React from 'react';

import './index.less';

import loadImg from './calcing.gif';


export default (props) => {

    return (
        <div className="hr-ajax-loading">
            <img src={loadImg}/>
            <span>{props.loadingTxt}</span>
        </div>
    );

}