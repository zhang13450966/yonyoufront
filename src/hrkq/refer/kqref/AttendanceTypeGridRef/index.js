/**
 * Created by liuchaol on 2019/05/09.
 */
import {high} from 'nc-lightapp-front';

const {Refer} = high;

export default function (props = {}) {
    var conf = {
        multiLang: {domainName: 'hrkq', currentLocale: 'zh-CN', moduleId: 'refer6065'},
        refType: 'grid',
        refName: 'i6065-000004',/* 国际化处理： 补考勤类型*/
        placeholder: 'i6065-000004',/* 国际化处理： 补考情类型*/
        refCode: 'hrkq.refer.kqref.AttendanceTypeGridRef',
        queryGridUrl: '/nccloud/hrkq/ref/AttendanceGridRefer.do',
        columnConfig: [{
            name: ['i6065-000003'],
            code: ['refname']
        }],/* 国际化处理： 级别序号,薪资标准类别,薪级数值*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}
