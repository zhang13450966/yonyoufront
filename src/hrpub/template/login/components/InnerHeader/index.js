import React from 'react';

import './index.less';

import Icon from 'antd-mobile/lib/icon';

export default (props) => {

    return (
        <div className="inner-header">
            <div className="header-icon-wrapper">
                <Icon
                    type="left"
                    className="inner-header-back-icon"
                    size="sm"
                    onClick={props.turnToPage(props.backTo, props.from)}
                />
                <Icon
                    type="cross"
                    className="inner-header-close-icon"
                    size="sm"
                    onClick={props.turnToPage(props.closeTo, props.from)}
                />
            </div>
            <span className="header-title">{props.title}</span>
        </div>
    );

}