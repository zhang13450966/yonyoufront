import {render,connect} from 'src/hrpub/common/frame'
import ModalAction from '../../actions/modal.js'
import headerAction from '../../actions/header.js'
import pubAction from '../../actions/pub'
import {base} from 'nc-lightapp-front'

const {NCModal,NCButton} = base
const PromptModal = render({
    actions: {
        modalAct: ModalAction,
        headAct: headerAction,
        pubAct: pubAction
    }
})(({props,state,action})=>{
    const {main} = props

    
    return(
        <div>
            <NCModal 
                visible = {
                    main.promptModalShow
                }
                onCancel = {
                    action.modalAct.colseClick
                }
            >
                <NCModal.Header  closeButton={true}>
                    <NCModal.Title>{main.json['hrpub-000159']}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <div
                        dangerouslySetInnerHTML = {{ __html: main.promptInfo }}
                    ></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <NCButton onClick={action.modalAct.yesClick}>{main.json['hrpub-000113']}</NCButton>
                    <NCButton onClick={action.modalAct.noClick}>{main.json['hrpub-000114']}</NCButton>
                    <NCButton onClick={action.modalAct.colseClick}>{main.json['hrpub-000056']}</NCButton>
                </NCModal.Footer>
            </NCModal>
        </div>
    )
})


export default connect(PromptModal)