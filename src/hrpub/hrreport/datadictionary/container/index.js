import React from 'react';

import render from '../../../../hrpub/common/frame/render';
import Layout from 'src/hrpub/common/components/Layout';
import mainAction from '../actions/main';

import {createPage,base} from 'nc-lightapp-front';

const { NCLoading } = base;

import { getAppPageConfig } from 'src/hrpub/common/utils/utils';

import './index.less';
import TableAction from '../actions/tableAction';

const HomePage =  render({
    
    actions: {
        ma: mainAction,
        ta: TableAction
    },
    customData: '',
    state: {
    }
})(({props, action, state}) => {
    const {DragWidthCom, syncTree, button, editTable: {createEditTable}, dd} = props;
    const {Header, Content} = Layout;
    return (
        <div className="data-dictionary">
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
                            treeId:'ddTree', // 组件id
                            onSelectEve: action.ma.onSelectEve,   //选择节点回调方法
                            needEdit: false,
                            needSearch: false,
                            showLine :true,  //是否显示连线，默认不显示
                            // defaultExpandAll : true, //默认展开所有节点
                        })}
                    </div>
                </div>
            }
            rightDom={
                // <Table {...props}/>
                <div className="nc-bill-table-area flex-container" style={{height: dd.height || '450px'}}>
                {createEditTable(
                    dd.tableId, //表格id
                    {
                        showIndex: true,
                        // showCheck: true,
                        // onSelected: action.ta.onSelected,
                        // onSelectedAll: action.ta.selectAll,
                        // onAfterEvent: action.ta.afterEventFn,
                        onRowClick: action.ta.clickHandle,
                        // height: dd.height || '450px'
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

        </div>
    )
});

export default createPage({})(HomePage);