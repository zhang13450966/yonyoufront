import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast} from 'nc-lightapp-front';
let {NCDatePicker, NCTable, NCButton, NCModal, NCStep, NCSelect, NCRow, NCCol} = base;
import './index.less'
import BasePanelChild from 'src/hrpub/common/components/hrPanels/container/panelChild'
import HRRefer from 'src/hrpub/common/components/hr-refer/index'
import HROrgTreeRef from "../../../../refer/uapbd/HROrgTreeRef";
export default class PsnType extends BasePanelChild {
    constructor(props) {
        super(props)
        this.state = {
            modalValue: null
        }
        this.selectChange = this.selectChange.bind(this)
    }
    selectChange(val) {

        this.setState({
            modalValue: val
        }, () => {
            this.setModalValue()
        })
    }

    // 必须实现 设置模板
    getChildComponent() {

        let json = this.context.ctx.props.hrpubJson
        var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
            refType: 'grid',
            refName: 'hrpub-000004',/* 国际化处理： 证书类型*/
            placeholder: 'hrpub-000004',/* 国际化处理： 证书类型*/
            refCode: 'hrwa.ref.MDEnumRefModel',
            queryGridUrl: '/nccloud/hrwa/ref/MDEnumRefModel.do',
            // columnConfig: [{name: [ 'hrpub-000005', 'hrpub-000006' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
            columnConfig: [{name: [ json['hrpub-000005'], json['hrpub-000006'] ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
            isMultiSelectedEnabled: false
        };
        return (
            <HRRefer
                className="psntype-refer"
                ref = "psntype-refer"
                {...conf}
            ></HRRefer>
        )
    }
}