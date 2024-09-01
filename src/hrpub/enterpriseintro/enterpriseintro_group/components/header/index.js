
import {render,connect} from '../../../../../hrpub/common/frame';
import { base } from 'nc-lightapp-front'
const { NCCheckbox } = base;
const Header = render({
    actions :{
        
    }
})(({props, action, state}) => {
    const {enterpriseGroup, button} = props
    const {json} = enterpriseGroup
    const {createButtonApp} = button
    return(
        <div className = "header nc-bill-header-area">
            <div className="header-panel left">
                <NCCheckbox colors="info" 
                    onChange={props.changeCheck}
                    checked={enterpriseGroup.isApply}
                    >
                    {/* 显示停用 */}
                    {json['orgmap-000259']}
                </NCCheckbox>
            </div>
            <div className="btn-group">
                {createButtonApp({
                    area : 'head',
                    onButtonClick : props.onButtonClick
                })}
            </div>
        </div>
    )
})   

export default connect(Header)