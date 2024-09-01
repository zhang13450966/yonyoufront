import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast} from 'nc-lightapp-front';
let {NCDatePicker, NCTable, NCButton, NCModal, NCStep, NCSelect, NCRow, NCCol} = base;
import './index.less'
import BasePanelChild from 'src/hrpub/common/components/hrPanels/container/panelChild'
const QueryItemAction = '/nccloud/hrwa/classitem/QueryChangeItemAction.do'
export default class HrSalaryChangePanel extends BasePanelChild {
    constructor(props) {
        super(props)
        this.state = {
            modalValue: null
        }
        this.QueryItemAction = '/nccloud/hrwa/classitem/QueryChangeItemAction.do'
        this.selectChange = this.selectChange.bind(this)
    }
    selectChange(val) {
        this.setState({
            modalValue: val
        }, () => {
            this.setModalValue()
        })
    }
    componentDidMount() {
        let pageConfig = this.context.ctx.props.pageConfig
        if (pageConfig.appcode === '60130411' || pageConfig.appcode === '60130410') {
            this.QueryItemAction = '/nccloud/hrwa/classitem/QueryChangeItemAction.do'
        } else {
            this.QueryItemAction = '/nccloud/hrwa/item/QueryChangeItemAction.do'
        }
        this.getOption()
    }
    // 获取下拉options
    getOption() {
        /*******************searchParam调用方式*******************/
        let searchParam = this.context.ctx.props.searchParam || {}
        ajax({
            url: this.QueryItemAction,
            data: searchParam,
            success: res => {
                if (res.success) {
                    let data = res.data
                    this.setState({
                        opts: this.formatOption(data)
                    })
                }
            }
        })
    }
    // 格式化原始数据
    formatOption(data) {
        let result = [{
            key: null,
            value: null
        }]
        data.map(obj => {
            result.push({
                key: obj.itemkey,
                value: obj.name
            })
        })
        return result
    }
    // 必须实现 设置模板
    getChildComponent() {

        let json = this.context.ctx.props.hrpubJson
        return (
            <div className="hr-panel-date">
                <NCRow className="hr-panel-date-div">
                    <NCCol md={8} xs={8} sm={8}>{json['hrpub-000059']}：</NCCol>
                    <NCCol md={16} xs={16} sm={16}>
                        <NCSelect
                            data = {this.state.opts}
                            value = {this.state.modalValue}
                            onChange = {this.selectChange.bind(this)}
                        />
                    </NCCol>
                </NCRow>
            </div>
        )
    }
}