import { ajax } from 'nc-lightapp-front';
import { PAGEAREA, UISTATE, PAGECODE, URL } from '../constance';
import { viewController } from '../viewController';
import { getBusinessInfo } from 'nc-lightapp-front';
import {
	getChangedRows,
	updateEditTableRows
} from '../../../../../scmpub/scmpub/pub/tool/editTableTools/getChangedRows';
export default function(props) {
	this.state.status = UISTATE.edit;
	//增行的时候付组织默认值
	let pk_org = this.state.pk_org;
	if (pk_org) {
		props.editTable.addRow(PAGEAREA.list, undefined, true, {
			pk_org,
			pk_group: { display: getBusinessInfo().groupName, value: getBusinessInfo().groupId }
		});
	}
	//修改bug中的重量输入值精度问题，需要去后台先查找到该精度，才可以输入。
	let changedRows = getChangedRows(props, PAGEAREA.list);
	let data = {
		pageid: PAGECODE,
		model: {
			areaType: 'table',
			areacode: PAGEAREA.list,
			PageInfo: {},
			rows: changedRows
		}
	};
	ajax({
		url: URL.addbefore,
		data: data,
		success: (res) => {
			if (res && res.success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				updateEditTableRows(props, PAGEAREA.list, res.data[PAGEAREA.list].rows);
				viewController.call(this, props, UISTATE.edit);
			}
		}
	});
}
