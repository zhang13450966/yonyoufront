import React from 'react';
import {high, getBusinessInfo} from 'nc-lightapp-front';
const {Refer} = high;
import BasePanelChild from 'src/hrpub/common/components/hrPanels/container/panelChild'
let businessInfo = getBusinessInfo() || {};
export default class LastStaffEstab extends BasePanelChild {
    constructor(props){
        super(props)
        this.state = {
            modalValue:null
        }
    }
    selectChange(val) {
        this.setState({
            modalValue: val
        }, () => {
            this.setModalValue()
            // debugger
            // this.props.onChange(val)
        })
    }
    getParam = (param = {}) => {
      /*******************searchParam调用方式*******************/
      let searchParam = this.context.ctx.props.searchParam || {}

        
      let queryCondition;
      
      if(searchParam){
        queryCondition = {
            year: (parseInt(searchParam.periodyear)-1).toString(),
        }
      }

        return queryCondition;
    };


    // 必须实现 设置模板
    getChildComponent() {
        let json = this.context.ctx.props.hrpubJson
        var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
            refType: 'grid',
            refName: 'hrpub-000147',
            placeholder: 'hrpub-000147',
            refCode: 'hrp.refer.BudgetDimGridRef.index',
            queryGridUrl: '/nccloud/hrp/ref/BudgetDimGridRef.do',
            columnConfig: [{name: [ json['hrpub-000005'] || '编码', json['hrpub-000006'] || '名称',json['hrpub-000124'] || '项目分类',json['hrpub-000125'] || '所属组织'],code: [ 'refcode', 'refname', 'category', 'orgname']}],/* 国际化处理： 编码,名称*/
            isMultiSelectedEnabled: false,
            value: this.state.modalValue
        };
        return (
            <Refer {...Object.assign(conf)} onChange={ (v)=>this.selectChange(v) } queryCondition={ this.getParam()} />
        )
    }
}



