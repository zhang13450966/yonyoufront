import React from 'react';

import render from '../../../../hrpub/common/frame/render';
import Layout from 'src/hrpub/common/components/Layout';
import mainAction from '../actions/main';
import treeAction from '../actions/tree';
import { createPage, base } from 'nc-lightapp-front';

const { NCLoading } = base;
import AddNewModel from '../components/addNewPage'
import EditTreeNode from '../components/editTreeNode'
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
import Pagination from "src/hrpub/common/components/Pagination";
import './index.less';
import TableAction from '../actions/tableAction';

const HomePage = render({

    actions: {
        ma: mainAction,
        ta: treeAction,
        tba: TableAction
    },
    customData: '',
    state: {
    }
})(({ props, action, state }) => {
    const { DragWidthCom, syncTree, button, rsc, search, editTable: {createEditTable}} = props;
    const { Header, Content } = Layout;
    return (
        <div className="report-stat-cond">
            <Header
                // 组织的时候加判断条件加上
                showOrgRefer={props.nodeType === 'org'}
                button={button}
                buttonOptions={{
                    area: 'list',
                    onButtonClick: action.ma.onHeaderClick
                }}
                orgReferOptions={{
                    getOrgData: action.ma.orgChange,
                    orgVal: rsc.orgVal
                }}
            >
            </Header>
            <DragWidthCom
                leftDom={
                    <div
                        className="left-content"
                    >
                        <div className="left-buttons-wrapper">
                            {button.createButtonApp({
                                area: 'tree',
                                onButtonClick: action.ta.onTreeClick
                            })}
                        </div>
                        <div
                            className="left-tree-wrapper"
                        >
                            {syncTree.createSyncTree({
                                treeId: 'rscTree', // 组件id
                                onSelectEve: action.ma.onSelectEve,   //选择节点回调方法
                                needEdit: false,
                                showLine: true,  //是否显示连线，默认不显示
                            })}
                        </div>
                    </div>
                }
                rightDom={
                    // 没加翻页
                    <div className="nc-bill-table-area  flex-container" style={{height: rsc.height || '450px'}}>
                        {createEditTable(
                            rsc.tableId, //表格id
                            {
                                showIndex: true,
                                showCheck: true,
                                onSelected: action.tba.onSelected,
                                onSelectedAll: action.tba.selectAll,
                                // onAfterEvent: action.tba.afterEventFn,
                                onRowClick: action.tba.clickHandle,
                                // height: props.height || '450px',
                                adaptionHeight: true,
                            }
                        )}
                        {/* <div style={{paddingTop:10}}>
                                {rsc.pageInfo.total ?<Pagination
                                    total = {rsc.pageInfo.total}
                                    pageSize = {rsc.pageInfo.pageSize}
                                    showQuickJumper ={true}
                                    showSizeChanger = {true}
                                    onChange = {action.tba.paginationEve}
                                    onShowSizeChange = {action.tba.pageSizeSelect}
                                    showSizeInput = {true}
                                /> : null}
                            </div>      */}
                    </div>
                    }
                defLeftWid='20%'    // 默认左侧区域宽度，px/百分百
                leftMinWid='180px'
            />
            <div style={{
                display: rsc.searchModalVisible ? 'block' : 'none'
            }}>
                {search.NCCreateSearch('query', {
                    clickSearchBtn: action.ma.goSearch,
                    onlyShowAdvArea: false,
                    showAdvSearchPlanBtn: true,
                    saveSearchPlan: true,
                    // oid: queryOid,
                    // oid: this.props.queryOid,
                    onlyShowSuperBtn: true
                })}
            </div>
            {/* <NCLoading
                container={this}
                show={state.show} >
            </NCLoading> */}
            <AddNewModel
                {...props}
            >  
            </AddNewModel>
            <EditTreeNode {...props}></EditTreeNode>
        </div>
    )
});

export default createPage({})(HomePage);