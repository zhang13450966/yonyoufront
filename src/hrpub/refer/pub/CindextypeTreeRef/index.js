/**
 * Created by wanghongxiang on 2018/5/21.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'tree',
        refName: 'hrpub-000010',/* 国际化处理： 能力素质指标类别*/
        placeholder: 'hrpub-000010',/* 国际化处理： 能力素质指标类别*/
        refCode: 'hrpub.refer.pub.CindextypeTreeRef',
        queryTreeUrl: '/nccloud/hrpub/ref/CindextypeTreeRef.do',
        rootNode: { refname: 'hrpub-000010', refpk: 'root' ,isleaf: false},/* 国际化处理： 能力素质指标类别*/
        columnConfig: [{name: [ 'hrpub-000005', 'hrpub-000006' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false,
    };

    return <Refer {...Object.assign(conf, props)} />
}
