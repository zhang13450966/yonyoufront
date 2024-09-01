import {render, connect} from "src/hrpub/common/frame"
import TableAction from '../../actions/table.js'
import {base} from 'nc-lightapp-front'
import './index.less'

const {NCCheckbox, NCScrollElement, NCAnchor, NCScrollLink} = base


const RightDom = render({
    actions: {
        tableAct: TableAction
    }
})(({props, state, action}) => {

    const {editTable, main, form} = props
    const {createEditTable} = editTable
    const {createForm} = form
    let isDisabled = main.status === 'browse' || (main.sysDataSet).indexOf(main.metadata) > -1 || main.mustCheckDisable;
    return (
        <div>
            <div className="content_title">
                <div style={{display: 'none'}}>
                    {createForm('psnclrule')}
                </div>
                <span className="content_checkbox">
                    <NCCheckbox
                        onChange={action.tableAct.onTitleBoxChange.bind(this, main.selectedIndex)}
                        checked={main.mustEntryFlag}
                        disabled={isDisabled}
                    >{main.json['hrpub-000160']}</NCCheckbox>
                </span>
                <span className="content_checkbox">
                    <NCCheckbox 
                        onChange={action.tableAct.needFileChange.bind(this,main.selectedIndex)}
                        checked = {main.isneedfile}
                        disabled = {main.status === 'browse' || (main.forFileSysData).indexOf(main.metadata)>-1 || main.needCheckDisable}
                    >{main.json['hrpub-000197'] || '附件必传'}</NCCheckbox>
                </span>
            </div>
            {main.selectedIndex !== null ?
                createEditTable('psnclinfoset' + main.selectedIndex, {
                    height: main.pageHeight - 120,
                    cancelCustomRightMenu: true,
                    adaptionHeight: false,
                    onAfterEvent: action.tableAct.onAfterTableEvent,
                    onBeforeEvent: action.tableAct.onBeforeTableEvent
                }) : null}
        </div>
    )

})
export default connect(RightDom)