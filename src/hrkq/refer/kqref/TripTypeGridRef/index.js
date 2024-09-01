/**
 * Created by liuchaol on 2019/05/09.
 */
import {high} from 'nc-lightapp-front';

const {Refer} = high;

export default function (props = {}) {
    var conf = {
        multiLang: {domainName: 'hrkq', currentLocale: 'zh-CN', moduleId: 'refer6065'},
        refType: 'grid',
        refName: 'i6065-000006',/* 国际化处理： 出差类型*/
        placeholder: 'i6013-000006',/* 国际化处理： 出差类型*/
        refCode: 'hrkq.refer.kqref.TripTypeGridRef',
        queryGridUrl: '/nccloud/hrkq/ref/TripTypeGridRefer.do',
        columnConfig: [{
            name: ['i6065-000003'],
            code: ['refname']
        }],/* 国际化处理： 级别序号,薪资标准类别,薪级数值*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}
