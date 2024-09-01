import React, { Component } from 'react';

import { connect } from 'src/hrpub/common/store';
import { base } from 'nc-lightapp-front';

// css
import './index.less';

// components

import { formatDate } from 'src/hrpub/common/utils/utils.js';

let { NCTable } = base;

export default class extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            state,
            props,
            props: {
                data = [],
                lang,
                tableId,
                height,
                onRowDoubleClick,
                editTable: { createEditTable }
            }
        } = this;

        data.forEach((item, index) => {
            item.key = item.key || index;
        })

        return (<div class="table">
            <NCTable
                // style={{ height }}
                columns={[
                    {
                        key: 'staffCode', //列的键
                        dataIndex: 'staffCode', //列的键
                        i18n: 'hrkq-0000018', //员工编码
                        // width: 150,
                        fixed: 'left', //当表水平滚动时，此列将被固定：true或'left'或'right'
                    },
                    {
                        key: 'staffName',
                        dataIndex: 'staffName',
                        i18n: 'hrkq-0000014', //姓名
                        // width: 150,
                        fixed: 'left', //当表水平滚动时，此列将被固定：true或'left'或'right'
                    },
                    {
                        key: 'deptName',
                        dataIndex: 'deptName',
                        i18n: 'hrkq-0000012', //部门
                    },

                    {
                        key: 'signtime',
                        dataIndex: 'signtime',
                        i18n: 'hrkq-0000022', //打卡时间
                        render(text, row, index) {
                            return (<span>{formatDate(text, ' ', 'm-d-h-m')}</span>);
                        }
                    },
                    {
                        key: 'placeName',
                        dataIndex: 'placeName',
                        i18n: 'hrkq-0000023', //打卡地点
                    },
                    {
                        key: 'addressDetail',
                        dataIndex: 'addressDetail',
                        i18n: 'hrkq-0000021', //详细地址
                        width: 200,
                        render(text, row, index) {
                            return (<div class="txt-elips">{text}</div>);
                        }
                    },
                    {
                        key: 'isoutside',
                        dataIndex: 'isoutside',
                        i18n: 'hrkq-0000024', //来源
                        render(text, row, index) {
                            return (<span>{(function (text, row, index) {
                                if (row.signType == 1) {
                                    // 0 1都为内勤
                                    switch (row.attendanceType) {
                                        // 0 GPS
                                        case '0':
                                            return lang['hrkq-0000069']
                                        // 1 WIFI 
                                        case '1':
                                            return lang['hrkq-0000069']
                                        // 2 外勤
                                        case '2':
                                            return lang['hrkq-0000068']
                                        // 3 补考勤
                                        case '3':
                                            return lang['hrkq-0000070']
                                    }
                                }
                                // 导入
                                if (row.signType == 2) {
                                    return lang['hrkq-0000071']
                                }
                                // 考勤机
                                if (row.signType == 3) {
                                    return lang['hrkq-0000072']
                                }
                            })(text, row, index)}</span>);
                        }
                    },
                ].map((column, index, list) => {
                    return {
                        ...column,
                        title: lang[column.i18n]
                    };
                })}
                data={data}
            />
        </div>);
    }
}
