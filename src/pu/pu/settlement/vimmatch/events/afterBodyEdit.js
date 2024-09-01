import { ajax, base, toast } from 'nc-lightapp-front';
import { AREA, URL, PAGECODE } from '../../constance';
export default function(props, moduleId, key, value, changedrows, index, record) {
	switch (key) {
		case 'ncurrentinvoicesettlemny':
			let event = props.createGridAfterEventData(PAGECODE.vim, AREA.feeView, moduleId, key, changedrows);
			
			event.grid[AREA.feeView].rows = event.grid[AREA.feeView].rows.filter((row) => {
				return row.rowid == changedrows[0].rowid;
			});
			ajax({
				method: 'post',
				url: URL.feeAfterEdit,
				async: false,
				data: event,
				success: (res) => {
					if (res && res.data) {
						//props.editTable.setTableData(AREA.feeView, res.data[AREA.feeView]);
						props.editTable.updateDataByIndexs(AREA.feeView, [{index:index, data: res.data[AREA.feeView].rows[0]}]);
					}
				},
				error: (res) => {
					toast({ content: res.message, color: 'danger' });
					props.editTable.setValByKeyAndIndex(AREA.feeView, index, key, changedrows[0].oldvalue);
				}
			});
			break;
		default:
			break;
	}
}
