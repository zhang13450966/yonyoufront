import React, { Component } from 'react';
import render from 'src/hrpub/common/frame/render';
import { connect } from 'src/hrpub/common/store';
// from nc
import { base, high } from 'nc-lightapp-front';
// components
let { NCDatePicker } = base;
import headerAction from '../../actions/headerAction';

const Header = render ({
    actions: {
        headerAction
    }
})(({props, action, state}) => {
    const { headerAction } = action
    const {
        visiable,
        format = 'YYYY-MM-DD',
        startPlaceholder = '',
        endPlaceholder = '',
        showTime = false,
        style = {},
        deptStat: {
            beginValue,
            endValue
        }
    } = props;
    
    return (
        <div class="date-range" style={{display: visiable ? '' : 'none'}}>
            <NCDatePicker
                style={style}
                showTime={showTime}
                format={format}
                value={beginValue}
                placeholder={startPlaceholder}
                onChange={headerAction.onBeginValueChange}
            />

            <span class="separator"></span>

            <NCDatePicker
                style={style}
                showTime={showTime}
                format={format}
                value={endValue}
                placeholder={endPlaceholder}
                onChange={headerAction.onEndValueChange}
            />
        </div>
    );
})
export default connect(Header);
