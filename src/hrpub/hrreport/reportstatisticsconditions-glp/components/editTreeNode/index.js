import React from 'react'

import Pagination from '../../../../../hrpub/common/components/Pagination/index';

import {render, connect} from '../../../../../hrpub/common/frame';

import TreeAction from '../../actions/tree';
import './index.less'

import { base } from 'nc-lightapp-front';
const {
    NCModal,
    NCButton
} = base;

const {
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter
} = NCModal;

const EditTreeNode = render({
    actions: {
        ta: TreeAction,
    },
    state: {
        flag:true
    },
})(({props, action, state}) => {
    const { button, editTable, rsc, form } = props;
    let { createEditTable } = editTable;
    return (
        <NCModal
        visible={rsc.editTreeVisible}
        onCancel={action.ta.closeModal}
        size="sm"
        // onShow={this.showEditForm}
    >
        <ModalHeader
            closeButton={true}
        >
            {rsc.treeType === 'add'? rsc.language["report-000061"] || '新增统计条件分类' : rsc.language["report-000062"] || '修改统计条件分类'/** 新增统计条件分类 */}
        </ModalHeader>
        <ModalBody>
            {form.createForm('sort', {
                onBeforeEvent: action.ta.onFormBeforeEvent,
            })}
        </ModalBody>
        <ModalFooter>
            <NCButton
                colors="primary"
                onClick={action.ta.submitTreeNodeEdit}
            >
                {rsc.language["report-000063"] || '确定'/** 确定 */}
            </NCButton>
            <NCButton
                onClick={action.ta.closeModal}
            >
                {rsc.language["report-000064"] || '取消'/** 取消 */}
            </NCButton>
        </ModalFooter>
    </NCModal>
        
    );

});

export default connect(EditTreeNode)