/**
 * Created by wanghongxiang on 2018/5/21.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'grid',
        refName: 'hrpub-000008',/* 国际化处理： 能力素质指标等级*/
        placeholder: 'hrpub-000008',/* 国际化处理： 能力素质指标等级*/
        refCode: 'hrpub.refer.pub.CindexgradeGridRef',
        queryGridUrl: '/nccloud/hrpub/ref/CindexgradeGridRef.do',
        columnConfig: [{name: [ 'hrpub-000005', 'hrpub-000006' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}
