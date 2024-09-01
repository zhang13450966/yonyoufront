import {render,connect} from '../../../../../hrpub/common/frame';
import  Pagination from '../../../../../hrpub/common/components/Pagination/index'
import EmptyImg from '../../../../../hrpub/common/components/emptyImg/index';
import './index.less'
const Table = render({
    actions :{
        
    }
})(({props, action, state}) => {
    const {enterpriseOrg, editTable} = props
    const {json} = enterpriseOrg
    const {createEditTable} = editTable
    const H = props.getHeight()
    return(
        <div className="tablePanel nc-bill-table-area">
            <div style={{display: enterpriseOrg.shwoTable ? 'block' : 'none', height: '100%'}}>
               <div className='flex-container tableContainer'>
                {
                        createEditTable('orgprolist',{
                            // height: H
                            adaptionHeight:true,
                            otherAreaHeight:enterpriseOrg.pageInfo.total ? 50:0,
                        })
                    }
                    <div className="pagination">
                        {enterpriseOrg.pageInfo.total ? <Pagination
                            total = {enterpriseOrg.pageInfo.total}
                            pageSize = {enterpriseOrg.pageInfo.pageSize}
                            showQuickJumper ={true}
                            showSizeChanger = {true}
                            onChange = {props.paginationEve}
                            onShowSizeChange = {props.pageSizeSelect}
                        /> :null}
                    </div>
               </div>
            </div>
            <div className="emptyCon" style={{display: enterpriseOrg.shwoTable ? 'none' : 'block'}}>
                {/* 暂无数据，请先选择人力组织！ */}
                <EmptyImg text={json['orgmap-000084']}/>
            </div>
        </div>
    )
})   

export default connect(Table)