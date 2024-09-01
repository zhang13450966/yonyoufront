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
        const {editTable, ddp} = this.props;
       editTable.setClickRowIndex(ddp.tableId, {
            record: record,
            index: index
        });
        editTable.focusRowByIndex(ddp.tableId, index);
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
            editTable, ddp
        } = this.props;
    
        if(status) {
            let allTableList = editTable.getAllRows(ddp.tableId);
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
   
}