/**
 * Created by wanghongxiang on 2018/5/21.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'grid',
        refName: 'hrpub-000026',/* 国际化处理： 国家地区(HR)*/
        placeholder: 'hrpub-000026',/* 国际化处理： 国家地区(HR)*/
        refCode: 'hrpub.refer.pub.HRCountryGridRef',
        queryGridUrl: '/nccloud/hrpub/ref/HRCountryGridRef.do',
        columnConfig: [{name: [ 'hrpub-000005', 'hrpub-000006' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}
