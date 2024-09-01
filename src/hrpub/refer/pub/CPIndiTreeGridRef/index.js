/**
 * Created by wanghongxiang on 2018/5/21.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'gridTree',
        refName: 'hrpub-000017',/* 国际化处理： 能力考核指标*/
        placeholder: 'hrpub-000017',/* 国际化处理： 能力考核指标*/
        refCode: 'hrpub.refer.pub.CPIndiTreeGridRef',
        queryTreeUrl: '/nccloud/hrpub/ref/CPindiTypeWithNoClassTreeRef.do',
        queryGridUrl: '/nccloud/hrpub/ref/CPIndiGridRef.do',
        rootNode: { refname: 'hrpub-000018', refpk: 'root' ,isleaf: false},/* 国际化处理： 能力考核指标类型*/
        columnConfig: [{
            name: [ 'hrpub-000005', 'hrpub-000006' ],/* 国际化处理： 编码,名称*/
            code: [ 'refcode', 'refname' ]
        }],
        isMultiSelectedEnabled: false,
    };

    return <Refer {...Object.assign(conf, props)} />
}
