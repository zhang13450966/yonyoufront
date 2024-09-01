import React from 'react';

import './index.less';

import { render, connect } from 'src/hrpub/common/frame';

import {
    base
} from 'nc-lightapp-front';
import OrgRefer from 'src/hrpub/common/components/referSearch/org';
import addAction from './actions/index';
import FormArea from './components/formArea';
const {
    NCModal,
    NCStep,
    NCButton,
    NCCheckbox,
    NCSelect
} = base;
const { NCOption } = NCSelect;
const {
    Header: NCModalHeader,
    Body: NCModalBody,
    Footer: NCModalFooter
} = NCModal;

const AddNewPage = render({
    actions: {
        aa: addAction,
    },
    state: {
        selectAll: false,
        selectRows: null
    }
})(({ props, state, action }) => {
    const {
        rsc,
        editTable,
        DragWidthCom,
        syncTree,
        form,
        modal
    } = props;
    const { addModalVisible } = rsc;
    let dom = document.getElementsByClassName('u-modal-body')[0]
    if (dom && addModalVisible) {
        dom.style.height = '401px'
    } else if (dom) {
        dom.style.height = 'auto'
    }

    return (
        <div>
            <NCModal
                mask="static"
                visible={addModalVisible}
                size="lg"
                className="add-new-modal"
                onCancel={action.aa.cancel}
            >
                <NCModalHeader
                    closeButton={true}
                >
                    {rsc.language["report-000065"] || 'HR报表统计条件'}{/* 国际化处理： 部门合并*/}
                </NCModalHeader>
                <NCModalBody>
                    <div className='modal-content-top'>
                        {
                            form.createForm('cond', {
                                onBeforeEvent: action.aa.onFormBeforeEvent,
                                onAfterEvent: action.aa.onFormAfterEvent
                            })
                        }
                    </div>
                    <div className='modal-content-content'>
                        <DragWidthCom
                            leftDom={
                                <div
                                    className="left-content"
                                >
                                    <div
                                        className="left-tree-wrapper"
                                    >
                                        {syncTree.createSyncTree({
                                            treeId: 'HRTree', // 组件id
                                            onSelectEve: action.aa.onSelectEve,   //选择节点回调方法
                                            needEdit: false,
                                        })}
                                    </div>
                                </div>
                            }
                            rightDom={
                                <div className='right-content'>
                                    <div className='right-content-top flex-container'>
                                        {editTable.createEditTable(
                                            'condTable', //表格id
                                            {
                                                // showIndex: true,
                                                onBeforeEvent: action.aa.tableBeforeEvent,
                                                onAfterEvent: action.aa.tableAfterEventFn,
                                                adaptionHeight: true
                                                // onRowClick: thi.clickHandle,
                                                // height: props.height || '450px'
                                            }
                                        )}
                                    </div>
                                    <div className='right-content-center'>
                                        <NCCheckbox colors="info"
                                            onChange={action.aa.changeCheck}
                                            checked={rsc.detailChecked}
                                        >{rsc.language["report-000066"] || '显示详情'}</NCCheckbox>
                                        <span style={{ float: 'right' }}>
                                            <NCButton onClick={() => action.aa.oper('left')}>{'('}</NCButton>
                                            <NCButton onClick={() => action.aa.oper('right')}>{')'}</NCButton>
                                            <NCButton onClick={() => action.aa.oper('AND')}>{'AND'}</NCButton>
                                            <NCButton onClick={() => action.aa.oper('OR')}>{'OR'}</NCButton>
                                        </span>
                                    </div>
                                    <div className='right-content-bottom'>
                                        {/* <textarea
                                    ref={(ref) => rsc.textareaRef = ref}
                                        // className="demo-input"
                                        type = 'text'
                                        value={rsc.sqlContrl}
                                        // onChange={action.aa.onSqlChange}
                                        onBlur={action.aa.onBlur}
                                        size="sm"
                                    /> */}
                                        <FormArea {...props} val={rsc.sqlContrl}></FormArea>
                                    </div>
                                </div>
                            }
                            defLeftWid='20%'    // 默认左侧区域宽度，px/百分百
                            leftMinWid='180px'
                        />
                    </div>
                </NCModalBody>
                <NCModalFooter>
                    <NCButton onClick={() => action.aa.makeSure('go')}>{rsc.language["report-000067"] || '保存新增'}</NCButton>
                    <NCButton onClick={() => action.aa.makeSure('save')}>{rsc.language["report-000068"] || '确认'}</NCButton>
                    <NCButton onClick={action.aa.cancel}>{rsc.language["report-000027"] || '取消'}</NCButton>
                </NCModalFooter>
            </NCModal>
        </div>
    );

});

export default connect(AddNewPage)