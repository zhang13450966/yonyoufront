/**
 * 模块配置文件
 * @author rongqb@yonyou.com
 * @date 20190520
 */
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
const {appcode, pagecode} = getAppPageConfig()
const name = 'attendance', 
    domainName = 'hrkq';

export default {
    name,
    domainName,
    // queryId: 'outside_query',


    modules: [
        {
            id: 'details',
            i18n: 'hrkq-000007',
            tableId: 'details_list',
            cardId: 'details_card',
            queryId: '',
            querySenior: false,
            queryAction: `/nccloud/hrkq/attendance/DetailsAction.do`,
            exportAction: `/ncchr/webservice/exportOriAttendRecordData`,
            exportTemplate: '/ncchr/shiftImport/getAttendRecordTemplate',
            saveAction: '/nccloud/hrkq/attendance/InsertRecordAction.do',
            delAction: '/nccloud/hrkq/attendance/DeleteRecordAction.do'
        },
        {
            id: 'attendance',
            i18n: 'hrkq-000009',
            tableId: 'attendance_list',
            cardId: 'attendance_card',
            queryId: 'attendance_query',
            queryTimeField: 'fill_date',
            querySenior: true,
            pk: 'pk_attendance',
            queryAction: `/nccloud/hrkq/attendance/QueryListAction.do`,
            exportAction: `/ncchr/webservice/exportAttendRcordsBillList`,
            exportTemplate: '/ncchr/fillAttendanceRecord/getFillAttendanceTemplate',
            saveAction: '/nccloud/hrkq/attendance/FillAttendanceSaveAction.do',
            delAction: '/nccloud/hrkq/attendance/FillAttendanceDeleteAction.do'
        },
        {
            id: 'outside',
            i18n: 'hrkq-000008',
            tableId: 'outside_list',
            cardId: 'outside_card',
            queryId: 'outside_query',
            queryTimeField: 'signdate',
            querySenior: true,
            pk: 'pk_outside',
            queryAction: `/nccloud/hrkq/outside/QueryListAction.do`,
            exportAction: `/ncchr/webservice/exportOriLegWorkRecordData`,
        },
        {
            id: 'abnormal',
            i18n: 'hrkq-0000010',
            tableId: 'abnormal_list',
            cardId: '',
            queryId: '',
            querySenior: false,
            queryAction: `/nccloud/hrkq/attendance/AbnormalAction.do`,
            exportAction: ` /ncchr/webservice/exportAbnormalSigns`,
        },
    ],
    appcode,
    pagecode,
    mutilLang: {
        moduleId: "hrkq0522",
        domainName
    }
}