import React, { Component } from 'react';
import { base, high, toast } from 'nc-lightapp-front';
import Header from 'src/hrkq/statistics/common/components/Header';
import { getCurMonthEndTs, getCurMonthStartTs } from 'src/hrkq/statistics/common/utils';

// css
import './index.less';

//职务
import Job from 'src/hrjf/refer/jfref/JobTypeJobRef/index';
//组织
import Org from 'src/hrpub/refer/pub/HRAdminOrgDefaultTreeRef/index';
//部门
import Dept from 'src/hrjf/refer/jfref/HRDeptTreeRef/index';

import config from '../../config/index';

let { NCInput, NCSelect, NCSelect: { NCOption}} = base;

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateRanger: {
                beginValue: getCurMonthStartTs(),
                endValue: getCurMonthEndTs()
            },
            queryParams: {
                orgId: '',
                jobId: '',
                deptId: ''
            }
        };
    }

    render(){
        const {
            props,
            props: {
                lang,
                tabActive
            },
            state,
            state: {
                queryParams,
                dateRanger,
            }
        } = this,
        stores = {
            overtimetype: {
                name: lang['hrkq-0000032'], //加班类型
                field: 'overtimetype',
                component: <NCSelect
                    value={queryParams.overtimetype || ' '}
                    style={{ width: 200 }}
                    onChange={function (e) {
                        this.onChange('overtimetype', e);
                    }}
                >
                    {[{
                        value: ' ',
                        label: lang[config['overtimetype'][' '].i18n] //全部
                    }, {
                        value: '1',
                        label: lang[config['overtimetype']['1'].i18n] //工作日加班
                    }, {
                        value: '2',
                        label: lang[config['overtimetype']['2'].i18n] //公休日加班
                    }, {
                        value: '3',
                        label: lang[config['overtimetype']['3'].i18n] //节假日加班
                    }].map(({ value, label}) => {
                        return (<NCOption value={value}>{label}</NCOption>);
                    })}
                </NCSelect>
            },
            approvestatus: {
                name: lang['hrkq-0000060'], //审批状态
                field: 'approvestatus',
                component: <NCSelect
                    value={queryParams.approvestatus || '-1'}
                    style={{ width: 200 }}
                    onChange={function (e) {
                        this.onChange('approvestatus', e);
                    }}
                >

                    {[{
                        value: '-1',
                        label: lang[config['approvestatus']['-1'].i18n] //自由态
                    },
                    {
                        value: '1',
                        label: lang[config['approvestatus']['1'].i18n] //审批通过
                    },
                    {
                        value: '3',
                        label: lang[config['approvestatus']['3'].i18n] //提交
                    },
                    {
                        value: '2',
                        label: lang[config['approvestatus']['2'].i18n] //审批中
                    },
                    {
                        value: '0',
                        label: lang[config['approvestatus']['0'].i18n] //未通过
                    }].map(({ value, label }) => {
                        return (<NCOption value={value}>{label}</NCOption>);
                    })}
                </NCSelect>
            },
            transferflag: {
                name: lang['hrkq-0000059'], //转调休状态
                field: 'transferflag',
                component: <NCSelect
                    style={{ width: 200 }}
                    value={queryParams.transferflag || ' '}
                    onChange={function (e) {
                        this.onChange('transferflag', e);
                    }}
                >
                    {[{
                        value: ' ',
                        label: lang[config['transferflag'][' '].i18n] //全部
                    }, {
                        value: '2',
                        label: lang[config['transferflag']['2'].i18n] //空
                    }, {
                        value: '0',
                        label: lang[config['transferflag']['0'].i18n] //待转
                    }, {
                        value: '1',
                        label: lang[config['transferflag']['1'].i18n] //已转
                    }].map(({ value, label }) => {
                            return (<NCOption value={value}>{label}</NCOption>);
                    })}
                </NCSelect>
            },
            billsource: {
                name: lang['hrkq-0000024'], //来源
                field: 'billsource',
                component: <NCSelect
                    style={{ width: 200 }}
                    value={queryParams.billsource || ' '}
                    onChange={function (e) {
                        this.onChange('billsource', e);
                    }}
                >
                    {[{
                        value: ' ',
                        label: lang[config['billsource'][' '].i18n] //全部
                    }, {
                        value: '0',
                        label: lang[config['billsource']['0'].i18n] //申请单
                    }, {
                        value: '1',
                        label: lang[config['billsource']['1'].i18n] //自动生成
                    }].map(({ value, label }) => {
                            return (<NCOption value={value}>{label}</NCOption>);
                    })}
                </NCSelect>
            },
            duration: {
                name: lang['hrkq-0000046'], //实际时长
                field: ['minlen', 'maxlen'],
                component: (
                    <div class="duration">
                        <NCInput
                            value={queryParams.minlen || ''}
                            style={{ width: 85 }}
                            placeholder={lang['hrkq-0000066']} //最小
                            onChange={function (e) {
                                if (e != '' && e != 0) {
                                    e = parseInt(e) || '';
                                }
                                this.onChange('minlen', `${e}`);
                            }}
                        />
                        <span class="separator"></span>
                        <NCInput
                            value={queryParams.maxlen}
                            style={{ width: 85 }}
                            placeholder={lang['hrkq-0000045']} //最大
                            onChange={function (e) {
                                if (e != '' && e != 0) {
                                    e = parseInt(e) || '';
                                }
                                this.onChange('maxlen', `${e}`);
                            }}
                        />
                    </div>),
                tip: lang['hrkq-0000064']
            },
            job: {
                name: lang['hrkq-0000013'],
                field: ['jobId'],
                component: <Job
                    value={queryParams.jobId}
                    isAlwaysEmitOnChange={true}
                    placeholder={lang['hrkq-0000013']}
                    onChange={function (refpk) {
                        this.onChange('jobId', refpk);
                    }}
                />
            },
            org: {
                name: lang['hrkq-0000011'], //组织
                field: ['orgId'],
                component: <Org
                    value={queryParams.orgId}
                    isAlwaysEmitOnChange={true}
                    placeholder={lang['hrkq-0000011']}
                    queryCondition={{
                        TreeRefActionExt: 'nccloud.web.hrkq.attendance.sqlbuilder.AttendApplyerOrgSqlBuilder'
                    }}
                    onChange={function (refpk) {
                        this.onChange('orgId', refpk);
                        this.onChange('deptId', '');
                    }}
                />
            },
            dept: {
                name: lang['hrkq-0000012'], //部门
                field: ['deptId'],
                component: <Dept
                    value={queryParams.deptId}
                    queryCondition={{
                        pk_org: queryParams.orgId.refpk,
                        TreeRefActionExt: 'nccloud.web.hrkq.attendance.sqlbuilder.AttendApplyerDeptSqlBuilder'
                    }}
                    isAlwaysEmitOnChange={true}
                    placeholder={lang['hrkq-0000012']}
                    onChange={function (refpk) {
                        this.onChange('deptId', refpk);
                    }}
                />
            },
            code: {
                name: `${lang['hrkq-0000014'] || ''}/${lang['hrkq-0000015'] || ''}`, //姓名/编码
                field: ['userName'],
                component: <NCInput
                    value={queryParams.userName}
                    style={{ width: 200 }}
                    placeholder={`${lang['hrkq-0000014'] || ''}/${lang['hrkq-0000015'] || ''}`}
                    onChange={function (e) {
                        this.onChange('userName', e);
                    }}
                />
            }
        };

        /**
         * 切换页签更改状态
         */
        /*if (tabActive &&
            (!this.state.tabActive ||
                (this.state.tabActive && this.state.tabActive.id !== tabActive.id))){
            this.setState((state, props)=>{
                return {
                    tabActive,
                    dateRanger: {
                        beginValue: getCurMonthStartTs(),
                        endValue: getCurMonthEndTs()
                    },
                    queryParams: Object.assign({}, ...Object.keys(state.queryParams).map(key => {
                        return {
                            [key]: ''
                        }
                    }))
                }
            });
        }*/

        let senior = [],
            base = [
                stores['org'],
                stores['code'],
            ];

        // 组织/部门 联动
        if (queryParams.orgId) {
            base.splice(1, 0, stores['dept']);
        };

        if (tabActive){
            switch(tabActive.id){
                case 'gather':  // 按人汇总
                    senior = [
                        stores['overtimetype'],
                        stores['job'],
                        stores['duration'],
                    ];
                    break;
                case 'details': // 加班明细
                    senior = [
                        stores['overtimetype'],
                        stores['billsource'],
                        stores['approvestatus'],
                        stores['transferflag'],
                        stores['duration'],
                    ];
                    break;
            }
        }
        // 参照的回调变为整个对象或者数组，传递给Header组件的值需要重构下
        let queryParamsInfo = {}
        Object.keys(queryParams).forEach(key => {
            if (key === 'orgId' || key === 'deptId' || key === 'jobId') {
                queryParamsInfo[key] = queryParams[key].refpk
            } else {
                queryParamsInfo[key] = queryParams[key]
            }
        })
        return (
            <Header
                { ...props }
                dateRanger={ dateRanger }
                base={base} // 基础模式
                senior={senior} // 高级模式
                queryParams={queryParamsInfo} // 查询参数
                onClear={() => {
                    this.setState((state, props) => {
                        return {
                            dateRanger: {
                                beginValue: getCurMonthStartTs(),
                                endValue: getCurMonthEndTs()
                            },
                            queryParams: Object.assign({}, ...Object.keys(state.queryParams).map(key=>{
                                return {
                                    [key]: ''
                                }
                            }))
                        }
                    });
                }}
                onChange={(key, value)=>{
                    switch(key){
                        case 'dateRanger':
                            this.setState((state, props) => {
                                return {
                                    dateRanger: value
                                }
                            });
                            break;
                        default:
                            this.setState((state, props)=>{
                                let parameter = {
                                    queryParams: Object.assign({}, state.queryParams, {
                                        [key]: value
                                    })
                                };
                                /**
                                * @desc: 选项为全部时 接口中取消传值 ' '
                                */
                                if (value === ' ') delete parameter.queryParams[key]
                                return parameter;
                            });
                    }

                }}>
            </Header>
        );
    }
}