import { base, toast, promptBox} from 'nc-lightapp-front';
import CommonAction from './commonAction';
export default class TableAction extends CommonAction{
    constructor(comp) {
        super();
        this.comp = comp;
        this.props = this.comp.props;
        this.dispatch = this.props.dispatch;
    }
    clickHandle = (props, moduleId, record, index) => {
        this.update({
            clickRow: {
                index: index,
                record: record
            }
        });
    }
    didMount = () => {
        
    }
    onSelected = (props, moduleId, record, index, isSelected) => {
        const {editTable, rsc} = this.props;
       editTable.setClickRowIndex(rsc.tableId, {
            record: record,
            index: index
        });
        editTable.focusRowByIndex(rsc.tableId, index);
        this.update({
            clickRow: {
                index: index,
                record: record
            }
        });
        // this.props.handleTableSelect(props, moduleId, record, index)
    };
    selectAll = (status) => {

        const {
            editTable, rsc
        } = this.props;
    
        if(status) {
            let allTableList = editTable.getAllRows(rsc.tableId);
            let selectedRows = [];
            allTableList.map((item, index) => {
                selectedRows.push({ 
                    data: item,
                    index: index
                });
            });
            this.update({
                selectedRows: selectedRows
            });
        }
        else {
            this.update({
                selectedRows: []
            });
        }
    }
    /**
     * 翻页
     */
    paginationEve = (key) => {
        const {props,action} = this.comp
        const {rsc} = props
        rsc.pageInfo.pageIndex = key;
        props.dispatch({
            type: 'rsc/update',
            payload: {
                pageInfo: rsc.pageInfo
            }
        })
        // action.ma.getTableData()
    }

    /**
     * 
     */
     pageSizeSelect = (val) => {
        const {props,action} = this.comp
        const {rsc} = props
        rsc.pageInfo.pageSize = val;
        rsc.pageInfo.pageIndex = 0;
        props.dispatch({
            type: 'rsc/update',
            payload: {
                pageInfo: rsc.pageInfo
            }
        })
        // action.ma.getTableData()
     }
}