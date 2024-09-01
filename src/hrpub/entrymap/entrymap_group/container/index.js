import {createPage} from 'nc-lightapp-front';
import {render} from '../../../../hrpub/common/frame';
import MainAction from '../action/main'
import HeaderAction from '../action/header'
import CardAction from '../action/card'
import Header from '../components/header/index'
import Card from '../components/card/index'
import './index.less'
const EntryMapGroup = render({
    actions: {
        mainAction: MainAction,
        cardAction: CardAction,
        headerAction: HeaderAction
    }
})(({props, action, state}) => {
    const {entrymapGroup} = props
    let json = entrymapGroup.json
    let jsonStr = JSON.stringify(json)
    const dom = jsonStr !== '{}' ? <div className="domCon">
                                        <Header {...props} 
                                            onButtonClick={action.headerAction.onButtonClick}
                                            handleTreeChange={action.headerAction.handleTreeChange}/>
                                        <Card {...props}/>
                                    </div> : ''
    return(
        <div className="entryMapGroup nc-bill-card">
            {
                dom
            }
        </div>
    )
}) 


export default createPage({
    billinfo: [
        {
            billtype: 'card', 
            pagecode: '60025010',
            headcode: 'entrymap'
        }
    ]
})(EntryMapGroup);