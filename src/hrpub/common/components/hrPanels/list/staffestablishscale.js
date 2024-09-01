import React from 'react';
import {high, getBusinessInfo} from 'nc-lightapp-front';
const {Refer} = high;
import BasePanelChild from 'src/hrpub/common/components/hrPanels/container/panelChild'
let businessInfo = getBusinessInfo() || {};
export default class StaffEstablishScale extends BasePanelChild {
    constructor(props){
        super(props)
        this.state = {
            modalValue:null,
            modalValue_second: null
        }
    }
    selectChange(val) {
        this.setState({
            modalValue: val,
        }, () => {
            if(this.state.modalValue_second){
                this.setModalValue()
            }
        })
    }
    selectChange1(val) {
        this.setState({
            modalValue_second: val
        }, () => {
            if(this.state.modalValue){
                this.setModalValue()
            }
        })
    }
    getParam1 = (param = {}) => {
      /*******************searchParam调用方式*******************/
      let searchParam = this.context.ctx.props.searchParam || {}

        
      let queryCondition;
      
      if(searchParam){
        queryCondition = {
            year: searchParam.periodyear
        }
      }

        return queryCondition;
    };
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
            refName: 'hrpub-000149',
            placeholder: 'hrpub-000149',
            refCode: 'hrp.refer.BudgetDimGridRef.index',
            queryGridUrl: '/nccloud/hrp/ref/BudgetDimGridRef.do',
            columnConfig: [{name: [ json['hrpub-000005'] || '编码', json['hrpub-000006'] || '名称',json['hrpub-000124'] || '项目分类',json['hrpub-000125'] || '所属组织' ],code: [ 'refcode', 'refname', 'category', 'orgname']}],/* 国际化处理： 编码,名称*/
            isMultiSelectedEnabled: false,
            value: this.state.modalValue
        };

        var conf1 ={ multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
            refType: 'grid',
            refName: 'hrpub-000150',
            placeholder: 'hrpub-000150',
            refCode: 'hrp.refer.BudgetDimGridRef.index',
            queryGridUrl: '/nccloud/hrp/ref/BudgetDimGridRef.do',
            columnConfig: [{name: [ json['hrpub-000005'] || '编码', json['hrpub-000006'] || '名称',json['hrpub-000124'] || '项目分类',json['hrpub-000125'] || '所属组织' ],code: [ 'refcode', 'refname', 'category', 'orgname']}],/* 国际化处理： 编码,名称*/
            isMultiSelectedEnabled: false,
            value: this.state.modalValue_second
        };
        return (
            <div>
                <Refer {...Object.assign(conf)} onChange={ (v)=>this.selectChange(v) } queryCondition={ this.getParam()} />
                <br/>
                <Refer {...Object.assign(conf1)} onChange={ (v)=>this.selectChange1(v) } queryCondition={ this.getParam1()} />
            </div>
        )
    }
}



