import { FIELDS, PAGECODE, PAGEAREA, URL } from '../constance';
import { createGridAfterEventData } from '../../../pub/tool/afterEditUtil';
import {
	getChangedRows,
	updateEditTableRows
} from '../../../../../scmpub/scmpub/pub/tool/editTableTools/getChangedRows';
import { ajax } from 'nc-lightapp-front';

/*
 * @Author: zhngzh 
 * @Date: 2019-05-06 18:24:01 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-09 16:02:06
 */
export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	//物料编辑后处理精度
	if (key == FIELDS.cmaterialvid || key == FIELDS.cpackageunit) {
		// let data = createGridAfterEventData(props, PAGECODE, PAGEAREA.list, moduleId, key, changedrows, i);
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
				}
			}
		});
	}
}
function clearValue(props, moduleId, i, fields) {
	for (let field of fields) {
		props.editTable.setValByKeyAndIndex(moduleId, i, field, { value: null, display: null });
	}
}
