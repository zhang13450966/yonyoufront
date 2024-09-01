import OrgRefer from 'src/hrpub/common/components/referSearch/org'
import HeaderAction from '../../actions/header.js'
import PubAction from '../../actions/pub'
import TableAction from '../../actions/table.js'
import { render,connect } from "src/hrpub/common/frame";
import PsnclRef from 'src/hrpub/refer/pub/PsnCLHRTreeRef/index'
import {base} from 'nc-lightapp-front'
import NCBackBtn from "src/hrpub/common/components/hr-back"

const {NCCheckbox} =base
const Header = render({
    actions: {
        headAct: HeaderAction,
        pubAct: PubAction,
        tableAct: TableAction
    }

})(({props,state,action})=>{
    const {main,button} = props
    const {createButtonApp} = button
    return(
        <div className="header">
            <div>
                <OrgRefer
                    orgVal={main.orgValue}
                    getOrgData={action.headAct.orgChange}
                    disabled={main.status === 'browse'? false:true}
                />
            </div>
            <div className="header-search">
                <PsnclRef
                    value={{refname: main.psnclName,refpk: main.psnclValue}}
                    onChange={action.headAct.psnclChange}
                    disabled={main.status === 'browse'? false:true}
                />
            </div>
            <div className="header-search">
                <NCCheckbox
                    onChange = {action.headAct.checkChange}
                    disabled = {main.checkDisable || !main.isEdit}
                    checked ={main.checkValue}
                >
                    {main.json['hrpub-000161']}
                </NCCheckbox>
            </div>         
            <div style={{marginLeft:'auto'}}>
                {createButtonApp({
                    area: 'head',
                    onButtonClick: action.headAct.onBtnClick
                })} 
            </div>
            
        </div>
    )
})


export default connect(Header)
