import React, {Component} from 'react';
import render from 'src/hrpub/common/frame/render';
import {connect} from 'src/hrpub/common/store';
import listAction from '../../actions/listAction';
import Pagination from 'src/hrpub/common/components/Pagination/index'
import emitter from '../../actions/emitterAction';

const tableId = 'leave_list'
const ListTable = render({
    actions: {
        listAction
    }
})(({props, action, state}) => {
    const {editTable, deptStat, tableCode, emitType} = props
    let pageInfo = deptStat[deptStat.activeTab + 'PageInfo']
    const {createEditTable} = editTable
    const {listAction} = action
    return (
        <div style={{display: deptStat.showMode === 'list' ? '' : 'none'}}>
            <div className={'flex-container'}
                 id="listTable"
                 style={{height: deptStat.clientHeight + 120 + 'px'}}>
                {createEditTable(tableCode, {
                    onRowDoubleClick: listAction.onRowDoubleClick,
                })}
                <div className="pagination" style={{marginTop: '10px'}}>
                    {pageInfo.total ? <Pagination
                        total={pageInfo.total}
                        pageSize={pageInfo.pageSize}
                        showQuickJumper={true}
                        showSizeChanger={true}
                        // current={pageInfo.pageIndex-1}
                        onChange={(pageIndex) => {
                            listAction.handlePageIndexChange(pageIndex, emitType)
                        }}
                        onShowSizeChange={(pageSize) => {
                            listAction.handlePageSizeChange(pageSize, emitType)
                        }}
                    /> : null}
                </div>
            </div>
        </div>
    )
})

export default connect(ListTable);