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
                lang,
                tableId,
                height,
                dayCol,
                dayData = [],
                onRowDoubleClick,
                pageInfo,
                pageIndexChange,
                pageSizeChange,
                deptStat,
                emitType
            }
        } = this;
        dayData.forEach((data, index) => {
            data.key = data.id || index
        })
        return (<div class="deptStat_table">
            <NCTable
                columns={this.handleCol(dayCol)}
                bodyStyle={{
                    height: height + 35 + 'px',
                    maxHeight: height + 35 + 'px'
                }}
                scroll={{
                    y: height,
                }}
                data={dayData}
            />
            <div className="pagination" style={{marginTop: '10px'}}>
                {pageInfo.total ? <Pagination
                    total={pageInfo.total}
                    pageSize={pageInfo.pageSize}
                    showQuickJumper={true}
                    showSizeChanger={true}
                    current={parseInt(pageInfo.pageIndex)}
                    // current={pageInfo.pageIndex-1}
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
        // const { initList } = this.props;
        // initList()
        const {emitter, emitType} = this.props;
        emitter.emit('searchData:' + emitType);
    }

    handleCol = (dayCol) => {
        const {deptStat} = this.props
        return dayCol.map((column, index, list) => {
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
                    return (<span>{moment(text - 0).format('MM-DD HH:ss')}</span>)
                } else {
                    let computedText = text ? text : ''
                    if (text === '0') {
                        computedText = ''
                    }
                    return (<span>{computedText}</span>)
                }
            }
            if (column.key === 'calendar') {
                newCol.render = (text, record, idnex) => {
                    return (<span>{moment(text - 0).format('MM-DD')}</span>)
                }
            }
            return newCol
        })
    }
}
