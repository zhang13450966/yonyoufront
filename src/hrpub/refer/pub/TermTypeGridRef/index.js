/**
 * Created by wanghongxiang on 2018/5/21.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'grid',
        refName: 'hrpub-000031',/* 国际化处理： 合同期限类型*/
        placeholder: 'hrpub-000031',/* 国际化处理： 合同期限类型*/
        refCode: 'hrpub.refer.pub.TermTypeGridRef',
        queryGridUrl: '/nccloud/hrpub/ref/TermTypeGridRef.do',
        columnConfig: [{name: [ 'hrpub-000005', 'hrpub-000006' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}
