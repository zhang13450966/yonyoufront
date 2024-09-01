
import commonModel from '../../../common/components/reportQuery/store/model';


export default {
    name: 'reportQuery',
    data: {
        ...commonModel.data,
        ifInit: false,
        reportTemplateMap: {
            '1001Z71000000000A3GV': 'WaItemQueryConditionPanelForGroup',
            '1001Z71000000000A3GX': 'WaAccountByYearQueryConditionPanel',
            '1001Z71000000000A3GZ': 'WaAccountByMonthQueryConditionPanel',
            // 人员类别汇总表
            '1001Z71000000000A3G7': 'WaSumByPsnclQueryConditionPanel',
            // 部门汇总表
            '1001Z71000000000A3G9': 'WaSumByDeptQueryConditionPanel',
            // 薪资明细表
            '1001Z71000000000A3GB': 'WaItemQueryConditionPanel',
            // 薪资变动明细表
            '1001Z71000000000A3FZ': 'WaBaseQueryConditionPanel',
            // 薪资变动减少汇总表
            '1001Z71000000000A3G1': 'WaBaseQueryConditionPanel',
            // 薪资变动净额汇总表
            '1001Z71000000000A3G3': 'WaBaseQueryConditionPanel',
            // 薪资变动增加汇总表
            '1001Z71000000000A3FR': 'WaBaseQueryConditionPanel',
            // 薪资变动汇总表
            '1001Z71000000000A3G5': 'WaBaseQueryConditionPanel',
            // 薪资变动净额明细表
            '1001Z71000000000A3FV': 'WaBaseQueryConditionPanel',
            // 薪资变动减少明细表
            '1001Z71000000000A3FX': 'WaBaseQueryConditionPanel',
            // 薪资变动增加明细表
            '1001Z71000000000A3FT': 'WaBaseQueryConditionPanel',
            // 员工收入台账
            '1001Z71000000000A3GT': 'PsnIncomeAccountQueryConditionPanel',
            // 单位预算数据与实际数据对照台账
            '1001Z71000000000A3GJ': 'OrgWaAccountQueryConditionPanel',
            // 单位薪资总额台账-实发模式
            '1001Z71000000000A3GD': 'OrgWaAccountQueryConditionPanel',
            // 多类别薪资发放汇总表
            '1001Z71000000000A3GP': 'WaMultiRptQueryConditionPanel',
            // 多类别薪资发放明细表
            '1001Z71000000000A3GR': 'WaMultiRptQueryConditionPanel',
            // 集团级薪资明细表  重复了 
            // '1001Z71000000000A3GV': 'WaItemQueryConditionPanelForGroup',
            // 单位年度工资台账
            // '1001Z71000000000A3GZ': 'WaAccountByMonthQueryConditionPanel',
            // 年度对比分析
            // '1001Z71000000000A3GX': 'WaAccountByYearQueryConditionPanel',
        },
        reportSearchMap: {
            '1001Z71000000000A3GZ': 'query',
            '1001Z71000000000A3GX': 'query',
            '1001Z71000000000A3GV': 'query',
             // 薪资变动明细表
             '1001Z71000000000A3FZ': 'wachange',
             // 薪资变动减少汇总表
             '1001Z71000000000A3G1': 'wachange',
             // 薪资变动净额汇总表
             '1001Z71000000000A3G3': 'wachange',
             // 薪资变动增加汇总表
             '1001Z71000000000A3FR': 'wachange',
             // 薪资变动汇总表
             '1001Z71000000000A3G5': 'wachange',
             // 薪资变动净额明细表
             '1001Z71000000000A3FV': 'wachange',
             // 薪资变动减少明细表
             '1001Z71000000000A3FX': 'wachange',
             // 薪资变动增加明细表
             '1001Z71000000000A3FT': 'wachange',
             // 人员类别汇总表
             '1001Z71000000000A3G7': 'psnclsum',
             // 薪资明细表
             '1001Z71000000000A3GB': 'waitem',
             // 部门汇总表
             '1001Z71000000000A3G9': 'deptsum',
             // 员工收入台账
             '1001Z71000000000A3GT': 'psnaccount', // 'psnaccount2'
             // 单位预算数据与实际数据对照台账
             '1001Z71000000000A3GJ': 'orgaccount',
             // 单位薪资总额台账-实发模式
             '1001Z71000000000A3GD': 'orgaccount',
             // 部门预算数据与实际数据对照台账
             '1001Z71000000000A3GN': 'deptaccount',
             // 部门薪资总额台账-实发模式
             '1001Z71000000000A3GL': 'deptaccount',
             // 多类别薪资发放汇总表
             '1001Z71000000000A3GP': 'waoutput',
             // 多类别薪资发放明细表
             '1001Z71000000000A3GR': 'waoutput',
             // 集团级薪资明细表
            //  '1001Z71000000000A3GV': 'query',
             // 年度对比分析
            //  '1001Z71000000000A3GX': 'query',
             // 单位年度工资台账
            //  '1001Z71000000000A3GZ': 'query'
        }
    },
    sync: {
        ...commonModel.sync
    },
    async: {
        ...commonModel.async
    }
};