import React, { Component } from 'react';
import render from 'src/hrpub/common/frame/render';
import { connect } from 'src/hrpub/common/store';
import NCBackBtn from 'src/hrkq/deptWork/deptStat/components/hr-back/index';
import headerAction from '../../actions/headerAction';
import './index.less'

const Header = render ({
    actions: {
        headerAction
    }
})(({props, action, state}) => {
    const { button, deptStat } = props
    const { createButtonApp } = button
    const { headerAction } = action
    return (
        <div className="my-leave">
            {/* 部门假勤统计 */}
            <div className="header">
                <div className="title">
                    <NCBackBtn
                        style={{display: deptStat.showMode === 'card' ? '' : 'none',marginRight: '10px'}}
                        onClick={ headerAction.clickBackBtn }
                    />
                    <div className="deptStat__title">{deptStat.headerTitle || deptStat.lang['hrkq-0000126']}</div>
                </div>
            </div>
        </div>
    );
})

export default connect(Header);