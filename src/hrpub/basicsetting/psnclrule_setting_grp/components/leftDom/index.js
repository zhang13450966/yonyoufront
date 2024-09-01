import { render,connect } from "src/hrpub/common/frame";
import HrTree from 'src/hrpub/common/components/hrTree/index.js'
import TreeAction from '../../actions/tree.js'
import pubAction from '../../actions/pub'
import './index.less'

const LeftDOM = render({
    actions: {
        treeAct: TreeAction,
        pubAct: pubAction
    }
})(({props,state,action})=>{
    const {main} = props
    return (
        <div>
            <HrTree
                 config = {{
                    root :{
                      title : main.json['hrpub-000155'],
                      key : 'root'
                    },
                    onSelect : action.treeAct.onSelect,
                    selectedKeys: [main.selectedKeys]
                }}
                treeData = {main.treeData}
            />
        </div>
    )
})

export default connect(LeftDOM)