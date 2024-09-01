/**
 * 模块配置文件
 * @author rongqb@yonyou.com
 * @date 20190520
 */
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
const {appcode, pagecode} = getAppPageConfig()
const name = 'overtime',
    domainName = 'hrkq';

export default {
    name,
    domainName,
    // queryId: 'outside_query',
    // 审批状态
    approvestatus: {
        '-1': { //自由态
            i18n: 'hrkq-0000097'
        },
        '1': { //审批通过
            i18n: 'hrkq-0000056'
        },
        '3': { //提交
            i18n: 'hrkq-0000054'
        },
        '2': { //审批中
            i18n: 'hrkq-0000055'
        },
        '0': { //未通过
            i18n: 'hrkq-0000057'
        }
    },

    overtimetype: {
        ' ': {
            i18n: 'hrkq-0000049' //全部
        }, 
        '1': {
            i18n: 'hrkq-0000061' //工作日加班
        }, 
        '2': {
            i18n: 'hrkq-0000062' //公休日加班
        }, 
        '3': {
            i18n: 'hrkq-0000063' //节假日加班
        }
    },
    // 来源
    billsource: {
        ' ':{
            i18n: 'hrkq-0000049' //全部
        }, 
        '0':{
            i18n: 'hrkq-0000048' //申请单
        }, 
        '1':{
            i18n: 'hrkq-0000047' //自动生成
        },
        '2':{
            i18n: 'hrkq-0000110' //手工录入
        },

    },

    // 转调休状态
    transferflag: {
        ' ': { //全部
            i18n: 'hrkq-0000049'
        }, 
        '0': { //待转
            i18n: 'hrkq-0000051'
        }, 
        '1': { //已转
            i18n: 'hrkq-0000052'
        }, 
        '2': { //空
            i18n: 'hrkq-0000050'
        },
        '3': { //已取消
            i18n: 'hrkq-0000132'
        },
    },
    
    modules: [
        {
            id: 'gather',
            i18n: 'hrkq-0000016',// 按人汇总
            tableId: 'gather_list',
            cardId: 'gather_form',
            queryId: '',
            querySenior: false,
            queryAction: `/nccloud/hrkq/overtime/QueryPageByPeopleAction.do`,
            exportAction: `/ncchr/overtime/diwork/exportTotalListBypsn4PC`,
        },
        {
            id: 'details',
            i18n: 'hrkq-0000017', // 加班明细
            tableId: 'details_list',
            cardId: 'details_form',
            queryId: '',
            querySenior: false,
            queryAction: `/nccloud/hrkq/overtime/QueryPageAction.do`,
            exportAction: `/ncchr/overtime/diwork/exportOtDetailByCond4PC`,
        },
    ],
    
    appcode,
    pagecode,
    mutilLang: {
        moduleId: "hrkq0522",
        domainName
    },
    hrCreateCard: 'overtime_card',
    cardId: 'details_form'
}