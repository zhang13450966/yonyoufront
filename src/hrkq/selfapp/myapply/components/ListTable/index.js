import React, {Component} from 'react';
import render from 'src/hrpub/common/frame/render';
import {connect} from 'src/hrpub/common/store';
import listAction from '../../actions/listAction';
import Pagination from 'src/hrpub/common/components/Pagination/index'

const ListTable = render({
    actions: {
        listAction
    }
})(({props, action, state}) => {
    const {editTable, myLeave, tableCode} = props
    let pageInfo = myLeave[myLeave.activeTab + 'PageInfo']
    const {createEditTable} = editTable
    const {listAction} = action
    return (
        <div style={{display: myLeave.showMode === 'list' ? '' : 'none'}}>
            <div style={{height: '100%'}} className={'flex-container'}>
                {createEditTable(tableCode, {
                    //height: myLeave.clientHeight,
                    onRowDoubleClick: listAction.onRowDoubleClick,
                    adaptionHeight: true
                })}
                <div className="pagination" style={{marginTop: '10px'}}>
                    {pageInfo.total ? <Pagination
                        total={pageInfo.total}
                        pageSize={pageInfo.pageSize}
                        showQuickJumper={true}
                        showSizeChanger={true}
                        // current={pageInfo.pageIndex-1}
                        onChange={listAction.handlePageIndexChange}
                        onShowSizeChange={listAction.handlePageSizeChange}
                    /> : null}
                </div>
            </div>
        </div>
    )
})

export default connect(ListTable);