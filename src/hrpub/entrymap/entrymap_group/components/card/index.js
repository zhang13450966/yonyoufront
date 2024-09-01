import {render,connect} from '../../../../../hrpub/common/frame';
import EmptyImg from '../../../../../hrpub/common/components/emptyImg/index';
import './index.less'
const Header = render({
    actions :{
        
    }
})(({props, action, state}) => {
    const {entrymapGroup, form} = props
    const {json} = entrymapGroup
    const {createForm} = form
    let isOrg = entrymapGroup.isOrg
    let pk_org = entrymapGroup.pk_org
    return(
        <div className = "card">
            <div style={{display: (!isOrg || (isOrg && pk_org)) ? 'block' : 'none'}}>
                {
                    createForm('entrymap')
                }
            </div>
            <div className="emptyCon" style={{display: (isOrg && !pk_org) ? 'block' : 'none'}}>
                {/* 暂无数据，请先选择人力组织！ */}
                <EmptyImg text={json['orgmap-000084']}/>
            </div>
        </div>
    )
})   

export default connect(Header)