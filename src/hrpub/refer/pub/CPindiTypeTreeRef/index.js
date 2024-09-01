/**
 * Created by wanghongxiang on 2018/5/21.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'tree',
        refName: 'hrpub-000018',/* 国际化处理： 能力考核指标类型*/
        placeholder: 'hrpub-000018',/* 国际化处理： 能力考核指标类型*/
        refCode: 'hrpub.refer.pub.CPindiTypeTreeRef',
        queryTreeUrl: '/nccloud/hrpub/ref/CPindiTypeTreeRef.do',
        rootNode: { refname: 'hrpub-000018', refpk: 'root' ,isleaf: false},/* 国际化处理： 能力考核指标类型*/
        columnConfig: [{name: [ 'hrpub-000005', 'hrpub-000006' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false,
    };

    return <Refer {...Object.assign(conf, props)} />
}
