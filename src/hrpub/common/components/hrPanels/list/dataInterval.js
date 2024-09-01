import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast} from 'nc-lightapp-front';
let {NCDatePicker, NCTable, NCButton, NCModal, NCStep, NCForm, NCRow, NCCol} = base;
import './index.less'
import BasePanelChild from 'src/hrpub/common/components/hrPanels/container/panelChild'
export default class HrDateIntervalPanel extends BasePanelChild {
    constructor(props) {
        super(props)
        this.state = {
            dateStart: '',
            dateEnd: ''
        }
    }
    dateSet(type, date) {
        setTimeout(()=>{
            this.setState({
                [type]: date
            }, ()=>{
                // 设置modalValue,默认是所有state，不符合条件可以重写
                this.setModalValue()
            })
        },0)

    }
    // 必须实现 设置模板
    getChildComponent() {
        let json = this.context.ctx.props.hrpubJson
        return (
            <div className="hr-panel-date">
                <NCRow className="hr-panel-date-div">
                    <NCCol md={8} xs={8} sm={8}>{json['hrpub-000057']}：</NCCol>
                    <NCCol md={16} xs={16} sm={16}>
                        <NCDatePicker
                            value={this.state.dateStart}
                            onChange = {this.dateSet.bind(this, 'dateStart')}
                        ></NCDatePicker>
                    </NCCol>
                </NCRow>
                <NCRow className="hr-panel-date-div">
                    <NCCol md={8} xs={8} sm={8}>{json['hrpub-000058']}：</NCCol>
                    <NCCol md={16} xs={16} sm={16}>
                        <NCDatePicker
                            value={this.state.dateEnd}
                            onChange = {this.dateSet.bind(this, 'dateEnd')}
                        ></NCDatePicker>
                    </NCCol>
                </NCRow>
            </div>
        )
    }
}