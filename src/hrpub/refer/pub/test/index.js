import { high } from 'nc-lightapp-front';
// import { conf as unitConf } from "/uapbd/refer/pubinfo/CountryDefaultGridRef/index";
const { Refer } = high;
const config = {
    multiLang: {
        domainName: 'uapbd',
        currentLocale: 'zh-CN',
        moduleId: 'refer_uapbd',
    },
    key: 'pk_country',
    refType: 'grid',
    refName: 'refer-000444', /* 国际化处理： 国家地区EX*/
    placeholder: 'refer-000444', /* 国际化处理： 国家地区EX*/
    refCode: 'uapbd.refer.pubinfo.CountryExDefaultGridRef',
    queryGridUrl: '/nccloud/uapbd/pub/CountryExDefaultGridRef.do',
    isMultiSelectedEnabled: false,
    columnConfig: [{
        name: ['refer-000002', 'refer-000441', 'refer-000003', 'refer-000422', 'refer-000442', 'refer-000443', 'refer-000445'], /* 国际化处理： 编码,三位代码,名称,描述,时区,格式,欧盟国家*/
        code: ['refcode', 'codeth', 'refname', 'description', 'timezonename', 'formatname', 'iseucountry'],
        checked: {
            description: false,
            timezonename: false,
            formatname: false,
            iseucountry: false,
        }
    }]
}
export default function (props = {}) {
    var conf = {
        refType: 'tree',
        refName: '行政区划',
        placeholder: '行政区划',
        rootNode: { refname: '行政区划', refpk: 'root' },
        refCode: 'uapbd.pubinfo.RegionDefaultTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/RegionDefaultTreeRef.do',
        treeConfig: {
            name: ['行政区划编码', '行政区划名称', '助记码'],
            code: ['refcode', 'refname', 'memcode']
        },
        isMultiSelectedEnabled: false,
        unitProps: <Refer {...config}></Refer>,
        isShowUnit: true

    };

    return <Refer {...Object.assign(conf, props) } />
}