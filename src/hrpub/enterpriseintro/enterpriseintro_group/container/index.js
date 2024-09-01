
import {createPage} from 'nc-lightapp-front';
import {render} from '../../../../hrpub/common/frame';
import Header from '../components/header/index'
import MainAction from '../actions/main'
import Table from '../components/table/index'
import AddEditModel from '../components/addEditModel/index'
import TableAction from '../actions/table'
import HeaderAction from '../actions/header'
import AddEditAction from '../actions/addEdit'
import './index.less'
const EnterpriseIntroGroup = render({
    actions: {
        mainAction: MainAction,
        tableAction: TableAction,
        headerAction: HeaderAction,
        addEditAction: AddEditAction
    }
})(({props, action, state}) => { 
    return(
        <div className="enterpriseGroup nc-bill-card">
            <Header {...props}
             changeCheck={action.headerAction.changeCheck}
             onButtonClick={action.headerAction.onButtonClick}/>
            <Table
            {...props}
            paginationEve={action.tableAction.paginationEve}
            pageSizeSelect={action.tableAction.pageSizeSelect}
            getHeight={action.tableAction.getHeight}/>
            <AddEditModel 
            closeModel={action.addEditAction.closeModel}
            uploadChange={action.addEditAction.uploadChange}
            pronameChange={action.addEditAction.pronameChange}
            profileChange={action.addEditAction.profileChange}
            saveFun={action.addEditAction.saveFun}/>
        </div>
    )
}) 


export default createPage({
    billinfo: [
        {
            billtype: 'grid', 
            pagecode: '60024010',
            headcode: 'orgprolist'
        }
    ]
})(EnterpriseIntroGroup);