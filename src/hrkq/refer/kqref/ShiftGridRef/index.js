/**
 * Created by liuchaol on 2019/05/09.
 */
import {high} from 'nc-lightapp-front';

const {Refer} = high;

export default function (props = {}) {
    var conf = {
        multiLang: {domainName: 'hrkq', currentLocale: 'zh-CN', moduleId: 'refer6065'},
        refType: 'grid',
        refName: 'i6065-000007',/* 国际化处理： 班次*/
        placeholder: 'i6065-000007',/* 国际化处理： 班次*/
        refCode: 'hrkq.refer.kqref.ShiftGridRef',
        queryGridUrl: '/nccloud/hrkq/ref/ShiftGridRefer.do',
        columnConfig: [{
            name: ['i6065-000001', 'i6065-000002', 'i6065-000008'],
            code: ['id', 'code', 'refname']
        }],/* 国际化处理：主键,编码,班次名称*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}
