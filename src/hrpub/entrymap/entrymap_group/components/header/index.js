import {render,connect} from '../../../../../hrpub/common/frame';
import OrgRefer from '../../../../../hrpub/common/components/referSearch/org';
import './index.less'
const Header = render({
    actions :{
        
    }
})(({props, action, state}) => {
    const {entrymapGroup, button} = props
    const {json} = entrymapGroup
    const {createButtonApp} = button
    let isOrg = entrymapGroup.isOrg
    let pk_org = entrymapGroup.pk_org
    let orgDisabled = entrymapGroup.orgDisabled
    return(
        <div className = "header nc-bill-header-area">
            <div className="header-panel">
                {/* 入职地图设置 */}
                <div className="headerTitle">{json['orgmap-000261']}</div>
            </div>
            <div className="orgCon" style={{display: isOrg ? 'block' : 'none'}}>
                <OrgRefer
                    getOrgData={props.handleTreeChange}
                    orgVal={entrymapGroup.orgValue}
                    disabled={orgDisabled}
                />
            </div>
            <div className="btn-group" style={{display: (!isOrg || (isOrg && pk_org)) ? 'block' : 'none'}}>
                {
                    createButtonApp({
                        area: 'head',
                        onButtonClick : props.onButtonClick
                    })
                }
            </div>
        </div>
    )
})   

export default connect(Header)