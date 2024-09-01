import {render,connect} from 'src/hrpub/common/frame'
import { base} from 'nc-lightapp-front';
const { NCModal, NCButton, NCCheckbox } = base;
// const {Transfer} = high;
import ModalAction from "../../actions/modal";
import Transfer from '../../../../../hrpub/common/components/TreeTransfer/Transfer';
const PromptModal = render({
    actions: {
        modalAct: ModalAction
    }
})(({props,state,action})=>{
    let { main } = props;
    let { dataSource, targetKeys, showTransferModal, json } = main;
    console.log("dataSource:::",dataSource)
    console.log("targetKeys:::",targetKeys)
    return (
        <NCModal 
            visible={showTransferModal} 
            onCancel={action.modalAct.colseTransferModal}
        >
            <NCModal.Header closeButton={true}>
                {/* 分配 */}
                <NCModal.Title>{json['hrpub-000174']}</NCModal.Title>
            </NCModal.Header>
            <NCModal.Body>
                <div className="transforCon">
                    <Transfer
                        {...props}
                        // onRef={this.onRef}
                        TransferId={'disapp'}
                        title={{
                            left: json['hrpub-000175'],
                            right: json['hrpub-000176']
                        }}/* 国际化处理： 待选行政组织,已选行政组织*/
                        leftTreeData={dataSource}
                        rightTreeData={targetKeys}
                        searchPlaceholder={'输入关键词搜索'}
                        // value={this.state.transferData}
                        // disableBtns={!this.state.editPageFlag}
                        leftTreeConfig={{
                            defaultExpandAll: true,
                            // defaultExpandedKeys: []
                        }}
                        rightTreeConfig={{
                            defaultExpandAll: true
                        }}
                        // searchValue={this.state.searchValue}
                        // leftSearch= {(val) =>{
                        //     console.log('sssss',val)
                        // }}
                        // treeType="VRFusion"
                        // onlySelf
                        hiddenAllMoveBtns = { true }
                        rightFixed = { true }
                        selectType={'onlySelf'}
                    />
                </div>
            </NCModal.Body>
            <NCModal.Footer>
                    <NCButton colors="primary" onClick={action.modalAct.assignCheckAction}>{json['hrpub-000177']}</NCButton>
                <NCButton onClick={action.modalAct.colseTransferModal}>{json['hrpub-000178']}</NCButton>
            </NCModal.Footer>
        </NCModal>
    )
})


export default connect(PromptModal)