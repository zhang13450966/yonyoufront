/*
 * @Author: jiangfw 
 * @PageInfo: 输出按钮控制器
 * @Date: 2019-03-13 16:38:10 
 * @Last Modified by: zhanghrh
 * @Last Modified time: 2019-08-09 11:30:04
 */
import { AREA, FIELD, BILLSTATUS, BUTTON, COMMON, STATUS, DATASOURCECACHE } from '../../constance/constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
let tableId = AREA.head;

export default function(props) {
	if (!props) {
		props = this.props;
	}

	let queryInfo = getDefData(COMMON.OrderOutputCache, 'queryInfo');
	// 刷新按钮
	props.button.setDisabled({
		[BUTTON.Refresh]: queryInfo ? false : true
	});
	let flag = STATUS.browse;
	let output = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELD.output);
	let isoutput = output == false ? true : false; // 是否发货
	let checkedRows = props.cardTable.getCheckedRows(AREA.cardTableId);
	// 反输出
	props.button.setButtonVisible([ BUTTON.UnOutPut ], flag && !isoutput);
	//输出
	props.button.setButtonVisible([ BUTTON.OutPut ], flag && isoutput);
	let rowsflag = checkedRows.length > 0 ? false : true;
	let disableArr = { [BUTTON.OutPut]: rowsflag, [BUTTON.UnOutPut]: rowsflag };
	props.button.setDisabled(disableArr);

	let selrows = props.insertTable.getCheckedRows(AREA.head);
	if (selrows == undefined || selrows.length == 0) {
		props.button.setButtonDisabled([ BUTTON.OutPut, BUTTON.UnOutPut ], true);
	} else {
		let outPutFlag = false;
		let queryInfo = props.search.getQueryInfo(AREA.list_query, false);
		if (queryInfo) {
			let conditions = queryInfo.querycondition.conditions;
			for (let condition of conditions) {
				if (condition.field == FIELD.output) {
					// outPutFlag = condition.value.firstvalue == 'Y' ? true : false;
					outPutFlag = condition.value.firstvalue;
				}
			}
		}
		if (outPutFlag) {
			//输出
			props.button.setButtonDisabled(BUTTON.OutPut, true);
			props.button.setButtonDisabled(BUTTON.UnOutPut, false);
		} else {
			//非输出
			props.button.setButtonDisabled(BUTTON.OutPut, false);
			props.button.setButtonDisabled(BUTTON.UnOutPut, true);
		}
	}
}
