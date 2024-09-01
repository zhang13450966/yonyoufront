/*
 * @Author: wangceb 
 * @PageInfo: 按钮的状态控制
 * 包括显示隐藏，可用性
 * @Date: 2018-04-19 10:38:05 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-08-12 14:36:43
 */
import { LIST_HEAD_BROWSE_STATUS_ACTIONS, BILL_STATUS, PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function(props) {
	let selrows = props.table.getCheckedRows(PREPAIDINVOICE_CONST.formId);

	if (selrows == undefined || selrows.length == 0) {
		props.button.setButtonDisabled(LIST_HEAD_BROWSE_STATUS_ACTIONS.ALL, true);
		// 除了新增，刷新，其他按钮不可用
		props.button.setButtonDisabled(LIST_HEAD_BROWSE_STATUS_ACTIONS.I_NODATA, false);
		// 选择一个的时候，根据状态判断
	} else if (selrows.length == 1) {
		props.button.setButtonDisabled(LIST_HEAD_BROWSE_STATUS_ACTIONS.ALL, true);
		props.button.setButtonDisabled(getDisabledBtnArray(props), false);
	} else {
		props.button.setButtonDisabled(LIST_HEAD_BROWSE_STATUS_ACTIONS.ALL, false);
	}
	// 刷新按钮根据是否点击过查询确定可用性
	let queryInfo = getDefData(PREPAIDINVOICE_CONST.SaleOrderReviseCacheKey, PREPAIDINVOICE_CONST.searchId);

	if (queryInfo == null) {
		props.button.setButtonDisabled([ 'Refresh' ], true);
	} else {
		props.button.setButtonDisabled([ 'Refresh' ], false);
	}
}

function getDisabledBtnArray(props) {
	let selrows = props.table.getCheckedRows(PREPAIDINVOICE_CONST.formId);

	let billstatus = selrows[0].data.values[PrepaidinvoiceHeadItem.FSTATUSFLAG].value;
	switch (billstatus) {
		// 自由态行按钮
		case BILL_STATUS.I_FREE:
			return LIST_HEAD_BROWSE_STATUS_ACTIONS.I_FREE;

			break;
		// 审批不通过
		case BILL_STATUS.I_NOPASS:
			return LIST_HEAD_BROWSE_STATUS_ACTIONS.I_NOPASS;

			break;
		// 审批中
		case BILL_STATUS.I_AUDITING:
			return LIST_HEAD_BROWSE_STATUS_ACTIONS.I_AUDITING;

			break;
		// 审批通过
		case BILL_STATUS.I_AUDIT:
			return LIST_HEAD_BROWSE_STATUS_ACTIONS.I_AUDIT;

			break;
		default:
			return '';
			break;
	}
}
