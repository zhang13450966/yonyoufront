/*
 * @Author: sunzhijun
 * @Date: 2019-06-06 16:25:44
 * @Last Modified by: sunzhijun
 * @Last Modified time: 2019-06-15 13:45:16
 */
import {high, getBusinessInfo} from 'nc-lightapp-front';
const {Refer} = high;
import './index.less'
import BasePanelChild from 'src/hrpub/common/components/hrPanels/container/panelChild';
let businessInfo = getBusinessInfo() || {};
export default class grant extends BasePanelChild {
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
        })
    }
    getParam = (param = {}) => {
        let queryCondition = {
            pk_org : businessInfo.groupId,
            pk_group : businessInfo.groupId
        }
        return queryCondition;
    };


    // 必须实现 设置模板
    getChildComponent() {
        let json = this.context.ctx.props.hrpubJson
        var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
            refType: 'grid',
            refName: 'hrpub-000059',/* 国际化处理： 证书类型*/
            placeholder: 'hrpub-000059',/* 国际化处理： 证书类型*/
            refCode: 'hrwa.refer.basic.WaItemGridRef.index',
            queryGridUrl: '/nccloud/hrwa/ref/WaItemGridRef.do',
            // columnConfig: [{name: [ 'hrpub-000005', 'hrpub-000006' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
            columnConfig: [{name: [ json['hrpub-000005'], json['hrpub-000006'],json['hrpub-000124'],json['hrpub-000125'] ],code: [ 'refcode', 'refname', 'category', 'orgname']}],/* 国际化处理： 编码,名称*/
            isMultiSelectedEnabled: false,
            value: this.state.modalValue
        };
        return (
            <Refer {...Object.assign(conf)} onChange={ (v)=>this.selectChange(v) } queryCondition={ this.getParam()} />
        )
    }
}
