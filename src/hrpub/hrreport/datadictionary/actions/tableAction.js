import { base, toast, promptBox} from 'nc-lightapp-front';
import {hrAjax as ajax} from 'src/hrpub/common/utils/utils';
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
        const {editTable, dd} = this.props;
       editTable.setClickRowIndex(dd.tableId, {
            record: record,
            index: index
        });
        editTable.focusRowByIndex(dd.tableId, index);
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
            editTable, dd
        } = this.props;
    
        if(status) {
            let allTableList = editTable.getAllRows(dd.tableId);
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