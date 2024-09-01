import {render,connect} from 'src/hrpub/common/frame'
import ModalAction from '../../actions/modal.js'
import OrgRefer from 'src/hrpub/common/components/referSearch/org'
import {base} from 'nc-lightapp-front'
import PsnclRefer from 'src/hrpub/refer/pub/PsnCLHRTreeRef/index'
import './index.less'

const {NCModal,NCButton} = base

const Model = render({
    actions: {
        modalAct: ModalAction
    }
})(({props,state,action})=>{
    const {main} = props

    return(
        <div>
            <NCModal 
                visible = {
                    main.modalShow
                }
                onCancel = {
                    action.modalAct.cancelClick
                }
            >
                <NCModal.Header  closeButton={true}>
                    <NCModal.Title>{main.json['hrpub-000156']}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <div className="modal-org">
                        
                        <span className="modal-span">
                            <span style={{color:' #f22c1d'}}>*</span>
                            {main.json['hrpub-000157']}
                        </span>
                        <span className="modal-refer">
                            <OrgRefer
                                orgVal={main.modalOrgValue}
                                getOrgData={action.modalAct.orgChange}
                                isMultiSelectedEnabled={true}
                            />
                        </span>
                    </div>
                    <div className="modal-psncl">
                        <span className="modal-span">
                            <span style={{color:' #f22c1d'}}>*</span>
                            {main.json['hrpub-000158']}
                        </span>
                        <span className="modal-refer">
                            <PsnclRefer
                                value={main.modalPsnclValue}
                                onChange={action.modalAct.psnclChange}
                                isMultiSelectedEnabled={true}
                            />
                        </span>
                    </div>
                </NCModal.Body>
                <NCModal.Footer>
                    <NCButton onClick={action.modalAct.sureClick}>{main.json['hrpub-000055']}</NCButton>
                    <NCButton onClick={action.modalAct.cancelClick}>{main.json['hrpub-000056']}</NCButton>
                </NCModal.Footer>
            </NCModal>
        </div>
    )
})


export default connect(Model)