import {render,connect} from '../../../../../hrpub/common/frame';
import  Pagination from '../../../../../hrpub/common/components/Pagination/index'
const Table = render({
    actions :{
        
    }
})(({props, action, state}) => {
    const {enterpriseGroup, editTable} = props
    const {createEditTable} = editTable
    const H = props.getHeight()
    return(
        <div className="tablePanel nc-bill-table-area">
            {
                enterpriseGroup.shwoTable ? createEditTable('orgprolist',{
                    // height: H
                    adaptionHeight:true,
                    otherAreaHeight:enterpriseGroup.pageInfo.total ? 50:0,
                }) : ''
            }
            <div className="pagination">
                {enterpriseGroup.pageInfo.total ? <Pagination
                    total = {enterpriseGroup.pageInfo.total}
                    pageSize = {enterpriseGroup.pageInfo.pageSize}
                    showQuickJumper ={true}
                    showSizeChanger = {true}
                    // current = {state.pageInfo.pageIndex}
                    onChange = {props.paginationEve}
                    onShowSizeChange = {props.pageSizeSelect}
                /> :null}
            </div>
        </div>
    )
})   

export default connect(Table)