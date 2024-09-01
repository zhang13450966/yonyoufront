import React, { Component } from 'react';
import render from 'src/hrpub/common/frame/render';
import { connect } from 'src/hrpub/common/store';
import cardAction from '../../actions/cardAction';

const CardDetail = render ({
    actions: {
        cardAction
    }
})(({props, action, state}) => {
    const { deptStat, form, formCode } = props
    const { cardAction } = action
    const {createForm} = form
    let display = deptStat.showMode==='card' && deptStat.activeTab + '_card' === formCode
    return (
        <div className="apply-card-detail" style={{display: display ? '' : 'none'}}>
            <div>
                {createForm(formCode, {
                    onAfterEvent: cardAction.onAfterEvent,
                    setVisibleByForm: true
                })}
            </div>
        </div>
    );
})


export default connect(CardDetail);