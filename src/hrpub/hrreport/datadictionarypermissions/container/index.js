import React from 'react';

import render from '../../../../hrpub/common/frame/render';
import Layout from 'src/hrpub/common/components/Layout';
import mainAction from '../actions/main';
import AddAction from '../components/addNewModal/actions/index';
import { createPage, base } from 'nc-lightapp-front';

const { NCLoading } = base;

import AddNewModal from '../components/addNewModal';
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';

import './index.less';
import TableAction from '../actions/tableAction';

const HomePage = render({

    actions: {
        ma: mainAction,
        aa: AddAction,
        ta: TableAction
    },
    customData: '',
    state: {
    }
})(({ props, action, state }) => {
    const { DragWidthCom, syncTree, button, editTable:{createEditTable}, ddp } = props;
    const { Header, Content } = Layout;
    return (
        <div className="data-dictionary-p">
            <Header
                showOrgRefer={false}
                button={button}
                buttonOptions={{
                    area: 'list',
                    onButtonClick: action.ma.onHeaderClick
                }}
            >
            </Header>
            <DragWidthCom
                leftDom={
                    <div
                        className="left-content"
                    >
                        <div
                            className="left-tree-wrapper"
                        >
                            {syncTree.createSyncTree({
                                treeId: 'ddpTree', // 组件id
                                onSelectEve: action.ma.onSelectEve,   //选择节点回调方法
                                needEdit: false,
                                needSearch: false,
                                showLine: true,  //是否显示连线，默认不显示
                                disabledSearch: true, //是否显示搜索框
                            })}
                        </div>
                    </div>
                }
                rightDom={
                    <div className="nc-bill-table-area flex-container" style={{height: ddp.height || '450px'}}>
                        {createEditTable(
                            ddp.tableId, //表格id
                            {
                                showIndex: true,
                                showCheck: true,
                                onSelected: action.ta.onSelected,
                                onSelectedAll: action.ta.selectAll,
                                // onAfterEvent: action.ta.afterEventFn,
                                onRowClick: action.ta.clickHandle,
                                // height: ddp.height || '450px',
                                adaptionHeight: true,
                            }
                        )}
                        {/* <Pagination/> */}
                    </div>
                }
                defLeftWid='20%'    // 默认左侧区域宽度，px/百分百
                leftMinWid='180px'
            />
            <NCLoading
                container={this}
                show={state.show} >
            </NCLoading>

            <AddNewModal
                {...props}
            ></AddNewModal>
        </div>
    )
});

export default createPage({})(HomePage);