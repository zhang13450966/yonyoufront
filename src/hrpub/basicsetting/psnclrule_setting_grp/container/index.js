import render from 'src/hrpub/common/frame/render'
import { createPage,base } from 'nc-lightapp-front';
import LeftDom from '../components/leftDom'
import RightDom from '../components/rightDom'
import './index.less'
import MainAction from '../actions/main.js'
import Modal from '../components/modal'
import {HrDragWidthCom} from 'src/hrpub/common/components/hr-layout/comps'
import OrgRefer from 'src/hrpub/common/components/referSearch/org'
import HeaderAction from '../actions/header.js'
import pubAction from '../actions/pub'
import tableAction from '../actions/table'
import PromptModal from '../components/promptModal'
import TransferModal from '../components/transferModal'
import Header from '../components/header'

const MainPage = render({
    actions: {
        mainAct: MainAction,
        headAct: HeaderAction,
        pubAct: pubAction,
        tableAct: tableAction
    }

})(({props,state,action})=>{
    const {DragWidthCom,main,button} = props
    const {createButtonApp} = button
    return(
        <div>
            <Header
                {...props}
            />  
            <div style={{height: main.pageHeight}}>
                <HrDragWidthCom
                    dragWidthCom = {
                         <DragWidthCom
                            leftDom ={
                                <LeftDom
                                    {...props}
                                />
                            }
                            rightDom = {
                                <RightDom
                                    {...props}
                                /> 
                            }
                        defLeftWid="15%"
                        />
                    }
                />  
            </div>
            <div>
               <Modal
                   {...props}
               />
            </div>
            <div>
                <PromptModal
                    {...props}
                />
                <TransferModal
                    {...props}
                />
            </div>
        </div>
    )
})


export default createPage({})(MainPage)
