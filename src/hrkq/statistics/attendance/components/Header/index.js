import React, { Component } from 'react';
import { base, high, toast } from 'nc-lightapp-front';
import Header from 'src/hrkq/statistics/common/components/Header';
import { getCurDayEndTs, getCurDayStartTs } from 'src/hrkq/statistics/common/utils';

// css
import './index.less';

//职务
import Job from 'src/hrjf/refer/jfref/JobTypeJobRef/index';
//组织
import Org from 'src/hrpub/refer/pub/HRAdminOrgDefaultTreeRef/index';
//部门
import Dept from 'src/hrjf/refer/jfref/HRDeptTreeRef/index';

import config from '../../config/index';

let { NCInput, NCSelect, NCSelect: { NCOption } } = base;

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateRanger: {
                beginValue: getCurDayStartTs(),
                endValue: getCurDayEndTs()
            },
            queryParams: {
                orgId: '',
                deptId: ''
            }
        };
    }

    render() {
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
                (this.state.tabActive && this.state.tabActive.id !== tabActive.id))) {
            this.setState((state, props) => {
                return {
                    tabActive,
                    dateRanger: {
                        beginValue: getCurDayStartTs(),
                        endValue: getCurDayEndTs()
                    },
                    queryParams: Object.assign({}, ...Object.keys(state.queryParams).map(key => {
                        return {
                            [key]: ''
                        }
                    }))
                }
            });
        }*/

        let base = [
                stores['org'],
                stores['job'],
                stores['code'],
            ];

        // 组织/部门 联动
        if (queryParams.orgId) {
            base.splice(1, 0, stores['dept']);
        };
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
                dateRanger={dateRanger}
                base={base} // 基础模式
                queryParams={queryParamsInfo} // 查询参数
                onChange={(key, value) => {
                    switch (key) {
                        case 'dateRanger':
                            this.setState((state, props) => {
                                return {
                                    dateRanger: value
                                }
                            });
                            break;
                        default:
                            this.setState((state, props) => {
                                return {
                                    queryParams: Object.assign({}, state.queryParams, {
                                        [key]: value
                                    })
                                }
                            });
                    }

                }}>
            </Header>
        );
    }
}