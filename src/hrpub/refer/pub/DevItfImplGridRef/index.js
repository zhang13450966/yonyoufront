/**
 * Created by wanghongxiang on 2018/5/21.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'grid',
        refName: 'hrpub-000019',/* 国际化处理： 开发接口实现*/
        placeholder: 'hrpub-000019',/* 国际化处理： 开发接口实现*/
        refCode: 'hrpub.refer.pub.DevItfImplGridRef',
        queryGridUrl: '/nccloud/hrpub/ref/DevItfImplGridRef.do',
        columnConfig: [{name: [ 'hrpub-000020', 'hrpub-000021' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 接口编码,实现名称*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}
