import React from 'react';

import './index.less';

import { render, connect } from 'src/hrpub/common/frame';
// import Transfer1 from 'src/hrpub/common/components/TreeTransfer/Transfer.js';
import Transfer from '../treeTransfer/index';
import Transfer1 from '../treeTransfer1/index';
import {
    base
} from 'nc-lightapp-front';
import OrgRefer from 'src/hrpub/common/components/referSearch/org';
import AddAction from './actions/index';
const {
    NCModal,
    NCStep,
    NCButton
} = base;

const {
    Header: NCModalHeader,
    Body: NCModalBody,
    Footer: NCModalFooter
} = NCModal;

const { NCSteps } = NCStep;


const AddModal = render({
    actions: {
        aa: AddAction,
    },
    state: {
        selectAll: false,
        selectRows: null
    }
})(({ props, state, action }) => {
    const {
        ddp,
        editTable,
        form
    } = props;
    const { addModalVisible, stepsCurrent } = ddp;

    return (
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
                {ddp.language["report-000044"] || '选择HR数据字典'}{/* 国际化处理： 选择HR数据字典*/}
            </NCModalHeader>
            <NCModalBody>
                <div className={'add-modal-header'}>
                    <NCSteps current={stepsCurrent} finishStatus="success">
                        <NCStep title={ddp.language["report-000045"] || '用户角色选择'} description="" />{/* 国际化处理： 用户角色选择*/}
                        <NCStep title={ddp.language["report-000044"] || '选择HR数据字典'} description="" />{/* 国际化处理： 选择HR数据字典*/}
                    </NCSteps>
                </div>
                <div className={'add-modal-warp'}>
                    <div className={'first-step'} style={{ display: stepsCurrent === 0 ? '' : 'none' }}>
                        <div className="select-org">
                            {
                                form.createForm('org', {
                                    // onBeforeEvent: this.onFormBeforeEvent,
                                    onAfterEvent: action.aa.onFormAfterEvent
                                })
                            }

                            {/* <span>业务单元+集团</span>
                        <OrgRefer
                            // getOrgData = {action.header.handleChangePeople}
                            // orgVal={props.orgValue}
                        /> */}
                        </div>
                        <Transfer {...props} />
                    </div>
                    {stepsCurrent === 1 ? <div className={'second-step'}>
                        <Transfer1 {...props} />
                    </div> : null}
                </div>

            </NCModalBody>
            <NCModalFooter>
                <NCButton disabled={stepsCurrent === 0} onClick={() => action.aa.stepHandle('last')}>{ddp.language["report-000025"] || '上一步'}</NCButton>
                {stepsCurrent === 0 ? <NCButton onClick={() => action.aa.stepHandle('next')}>{ddp.language["report-000024"] || '下一步'}</NCButton>
                    : <NCButton onClick={() => action.aa.finish('go')}>{ddp.language["report-000046"] || '完成并继续'}</NCButton>}
                <NCButton disabled={stepsCurrent === 0} onClick={() => action.aa.finish('close')}>{ddp.language["report-000026"] || '完成'}</NCButton>
                <NCButton onClick={action.aa.cancel}>{ddp.language["report-000027"] || '取消'}</NCButton>
            </NCModalFooter>
        </NCModal>
    );

});

export default connect(AddModal)