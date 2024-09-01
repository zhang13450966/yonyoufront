import { TARGETADJ_CARD } from '../../siconst';

export default function(props, moduleid, key) {
	if (key == TARGETADJ_CARD.tableOldId) {
		if (this.oldtabledata) {
			this.props.cardTable.setTableData(TARGETADJ_CARD.tableId, { rows: this.oldtabledata });
		}
	}
}
