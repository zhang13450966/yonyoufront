import { PAGEAREA, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { getBusinessInfo } from 'nc-lightapp-front';
export default function(props) {
	if (props.editTable.getStatus(PAGEAREA.list) != UISTATE.edit) {
		viewController.call(this, props, UISTATE.edit);
	}
	//增行的时候赋值组织默认值
	let pk_org = this.state.pk_org;
	if (pk_org) {
		props.editTable.addRow(PAGEAREA.list, undefined, false, {
			pk_org,
			pk_group: { display: getBusinessInfo().groupName, value: getBusinessInfo().groupId }
		});
	}
	// let changedRows = getChangedRows(props, PAGEAREA.list);
	// let data = {
	// 	pageid: PAGECODE,
	// 	model: {
	// 		areaType: 'table',
	// 		areacode: PAGEAREA.list,
	// 		PageInfo: {},
	// 		rows: changedRows
	// 	}
	// };
	// ajax({
	// 	url: URL.addbefore,
	// 	data: data,
	// 	success: (res) => {
	// 		if (res && res.success) {
	// 			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
	// 				props.dealFormulamsg(res.formulamsg);
	// 			}
	// 			res.data[PAGEAREA.list].rows.map((item) => {
	// 				props.editTable.setValByKeyAndRowId(
	// 					PAGEAREA.list,
	// 					item.rowid,
	// 					'nmaxweight',
	// 					item.values.nmaxweight
	// 				);
	// 				props.editTable.setValByKeyAndRowId(PAGEAREA.list, item.rowid, 'nvolumn', item.values.nmaxweight);
	// 			});
	// 			viewController.call(this, props, UISTATE.edit);
	// 		}
	// 	}
	// });
}
