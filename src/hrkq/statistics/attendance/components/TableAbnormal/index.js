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

        this.state = {
            columns: [
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
                    i18n: 'hrkq-0000019', //签到时间
                    render(text, row, index) {
                        return (<span>{formatDate(text, ' ', 'm-d-h-m')}</span>);
                    }
                },
                {
                    key: 'placeName',
                    dataIndex: 'placeName',
                    i18n: 'hrkq-0000020', //签到地点
                },
                {
                    key: 'addressDetail',
                    dataIndex: 'addressDetail',
                    i18n: 'hrkq-0000021', //详细地址
                },
            ]
        }
    }
    render() {
        const {
            state,
            state: {
                columns
            },
            props,
            props: {
                data = [],
                lang,
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
                columns={columns.map((column, index, list) => {
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
