/**
 * Created by wanghongxiang on 2018/5/21.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'grid',
        refName: 'hrpub-000022',/* 国际化处理： 能力考核等级组*/
        placeholder: 'hrpub-000022',/* 国际化处理： 能力考核等级组*/
        refCode: 'hrpub.refer.pub.GradeRuleGridRef',
        queryGridUrl: '/nccloud/hrpub/ref/GradeRuleGridRef.do',
        columnConfig: [{name: [ 'hrpub-000023', 'hrpub-000024' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 等级组名称,描述*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}
