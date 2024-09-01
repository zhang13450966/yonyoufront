/**
 * Created by wanghongxiang on 2018/5/21.
 */
import {high} from 'nc-lightapp-front';

const {Refer} = high;

export default function (props = {}) {
    var conf = {
        multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'grid',
        refName: 'hrpub-000027',/* 国际化处理： 员工信息项*/
        placeholder: 'hrpub-000027',/* 国际化处理： 员工信息项*/
        refCode: 'hrpub.refer.pub.ParaInfSetandFldGridRef',
        queryGridUrl: '/nccloud/hrpub/ref/ParaInfSetandFldGridRef.do',
        columnConfig: [{name: ['hrpub-000028', 'hrpub-000029'], code: ['refcode', 'refname']}],/* 国际化处理： 信息集名称,信息项名称*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}
