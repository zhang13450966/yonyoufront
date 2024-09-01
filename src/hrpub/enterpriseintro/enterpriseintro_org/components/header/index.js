
import {render,connect} from '../../../../../hrpub/common/frame';
import OrgRefer from '../../../../../hrpub/common/components/referSearch/org';
import { base } from 'nc-lightapp-front'
const { NCCheckbox } = base;
const Header = render({
    actions :{
        
    }
})(({props, action, state}) => {
    const {enterpriseOrg, button} = props
    const {json} = enterpriseOrg
    const {createButtonApp} = button
    return(
        <div className = "header nc-bill-header-area">
            <div className="header-panel left">
                <OrgRefer
                    getOrgData={props.handleTreeChange}
                    orgVal={enterpriseOrg.orgValue}
                />
            </div>
            <div className="headerCheckbox" style={{display: enterpriseOrg.shwoTable ? 'block' : 'none'}}>
                <NCCheckbox colors="info" 
                    onChange={props.changeCheck}
                    checked={enterpriseOrg.isApply}
                    >
                    {/* 显示停用 */}
                    {json['orgmap-000259']}
                </NCCheckbox>
            </div>
            <div className="btn-group" style={{display: enterpriseOrg.shwoTable ? 'block' : 'none'}}>
                {createButtonApp({
                    area : 'head',
                    onButtonClick : props.onButtonClick
                })}
            </div>
        </div>
    )
})   

export default connect(Header)