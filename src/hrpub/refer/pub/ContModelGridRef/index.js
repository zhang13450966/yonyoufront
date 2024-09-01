/**
 * Created by wanghongxiang on 2018/5/21.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'grid',
        refName: 'hrpub-000011',/* 国际化处理： 合同模板*/
        placeholder: 'hrpub-000011',/* 国际化处理： 合同模板*/
        refCode: 'hrpub.refer.pub.ContModelGridRef',
        queryGridUrl: '/nccloud/hrpub/ref/ContModelGridRef.do',
        columnConfig: [{name: [ 'hrpub-000012', 'hrpub-000013' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 模版编码,模版名称*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}
