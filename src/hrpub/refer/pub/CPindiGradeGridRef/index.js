/**
 * Created by wanghongxiang on 2018/5/21.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'grid',
        refName: 'hrpub-000014',/* 国际化处理： 能力考核指标等级*/
        placeholder: 'hrpub-000014',/* 国际化处理： 能力考核指标等级*/
        refCode: 'hrpub.refer.pub.CPindiGradeGridRef',
        queryGridUrl: '/nccloud/hrpub/ref/CPindiGradeGridRef.do',
        columnConfig: [{name: [ 'hrpub-000015', 'hrpub-000016' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 等级名称,等级描述*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}
