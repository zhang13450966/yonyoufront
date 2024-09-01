import React, {Component} from 'react';
import moment from 'moment';
import {base} from 'nc-lightapp-front';
import Pagination from 'src/hrpub/common/components/Pagination/index'

// css
// import './index.less';

// components

import {formatDate} from 'src/hrpub/common/utils/utils.js';

let {NCTable} = base;

export default class extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            props: {
                data = [],
                lang,
                tableId,
                height,
                monthCol,
                monthData = [],
                pageInfo,
                pageIndexChange,
                pageSizeChange,
                deptStat,
                emitType
            }
        } = this;

        data.forEach((item, index) => {
            item.key = item.key || index;
        })

        return (<div class="deptStat_table">
            <NCTable
                columns={this.handleCol(monthCol)}
                bodyStyle={{
                    height: height + 35 + 'px',
                    maxHeight: height + 35 + 'px'
                }}
                scroll={{
                    y: height,
                }}
                data={monthData}
            />
            <div className="pagination" style={{marginTop: '10px'}}>
                {pageInfo.total ? <Pagination
                    total={pageInfo.total}
                    pageSize={pageInfo.pageSize}
                    showQuickJumper={true}
                    showSizeChanger={true}
                    onChange={(pageIndex) => {
                        pageIndexChange(pageIndex, emitType)
                    }}
                    onShowSizeChange={(pageSize) => {
                        pageSizeChange(pageSize, emitType)
                    }}
                /> : null}
            </div>
        </div>);
    }

    componentDidMount() {
        const {emitter, emitType} = this.props;
        emitter.emit('searchData:' + emitType);
    }

    handleCol = (monthCol) => {
        const {deptStat} = this.props
        return monthCol.map((column, index, list) => {
            let newCol = {
                ...column,
                title: column.name,
                dataIndex: column.key
            }
            newCol.render = (text, record, idnex) => {
                // 0:整形 1:数值型 2：字符 3：布尔 4：日期
                if (column.datatype === '3') {
                    return (<span>{text ? deptStat.lang['hrkq-0000082'] : deptStat.lang['hrkq-0000083']}</span>)
                } else if (column.datatype === '4') {
                    return (<span>{text ? moment(text - 0).format('MM-DD HH:ss') : ''}</span>)
                } else {
                    let computedText = text ? text : ''
                    if (text === '0') {
                        computedText = ''
                    }
                    return (<span>{computedText}</span>)
                }
            }
            return newCol
        })
    }
    handleData = (monthData) => {
        return monthData.map((data, index, list) => {
            Object.keys(data).forEach(key => {
                data[key] = data[key] === '0' ? '' : data[key];
            })
            return data
        })
    }
}
