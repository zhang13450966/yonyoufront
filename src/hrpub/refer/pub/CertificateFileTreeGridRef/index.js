/**
 * Created by wanghongxiang on 2018/5/21.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'hrpub'},
        refType: 'gridTree',
        refName: 'hrpub-000000',/* 国际化处理： 证书档案*/
        placeholder: 'hrpub-000000',/* 国际化处理： 证书档案*/
        refCode: 'hrpub.refer.pub.CertificateFileTreeGridRef',
        queryTreeUrl: '/nccloud/hrpub/ref/CertificateKindTreeRef.do',
        queryGridUrl: '/nccloud/hrpub/ref/CertificateFileGridRef.do',
        rootNode: { refname: 'hrpub-000001', refpk: 'root' ,isleaf: false},/* 国际化处理： 证书档案类型*/
        columnConfig: [{
            name: [ 'hrpub-000002', 'hrpub-000003' ],/* 国际化处理： 证书编码,证书名称*/
            code: [ 'refcode', 'refname' ]
        }],
        isMultiSelectedEnabled: false,
    };

    return <Refer {...Object.assign(conf, props)} />
}
