import { URL, PAGECODE, FIELD, STATUS, LIST_BUTTON, OrderReviseCache } from '../../constance';

/**
 * 列表行操作按钮
 * @param {*} record
 */
function getListRowButtons(record) {
	// 当存在修订历史才显示操作“查看修订记录”，否则不显示； 采购订单表头字段版本号大于1的即代表已修订
	let nversion = record && record.nversion && record.nversion.value;
	let forderstatus = record && record.forderstatus && record.forderstatus.value;

	let buttonAry = [
		LIST_BUTTON.Revise,
		LIST_BUTTON.Revised_Record_Info,
		LIST_BUTTON.Delete,
		LIST_BUTTON.ApproveInfo
	];
	if (nversion > 1) {
		if (FIELD.free == forderstatus) {
			//自由或者审批不通过可见，修订，修订历史，修订删除
			buttonAry = [
				LIST_BUTTON.Revise,
				LIST_BUTTON.Commit,
				LIST_BUTTON.Revised_Record_Info,
				LIST_BUTTON.Delete,
				LIST_BUTTON.ApproveInfo,
				LIST_BUTTON.ToInformation
			];
		} else if (FIELD.unapproved == forderstatus) {
			buttonAry = [
				LIST_BUTTON.Revise,
				LIST_BUTTON.Revised_Record_Info,
				LIST_BUTTON.Delete,
				LIST_BUTTON.ApproveInfo,
				LIST_BUTTON.ToInformation
			];
		} else {
			buttonAry = [ LIST_BUTTON.Revise, LIST_BUTTON.Revised_Record_Info, LIST_BUTTON.ApproveInfo ];
		}
	} else {
		buttonAry = [ LIST_BUTTON.Revise, LIST_BUTTON.ApproveInfo ];
	}

	return buttonAry;
}

/**
 * 页面初始化按钮控制
 */
function initButtons() {
	let rows = this.props.table.getCheckedRows(PAGECODE.list_head);
	let noEdit = true;
	noEdit = rows.length > 0 ? false : noEdit;
	let disableArr = {
		[LIST_BUTTON.Annex_Management]: noEdit,
		[LIST_BUTTON.QueryAboutBusiness]: noEdit,
		[LIST_BUTTON.Print]: noEdit,
		[LIST_BUTTON.PrintCountQuery]: noEdit,
		[LIST_BUTTON.Commit]: noEdit,
		[LIST_BUTTON.UnCommit]: noEdit,
		[LIST_BUTTON.ToInformation]: noEdit,
		[LIST_BUTTON.Refresh]: false
	};
	this.props.button.setDisabled(disableArr);
}

/**
 * 页面表格数据勾选事件控制
 */
function onSelectedButtons() {
	let rows = this.props.table.getCheckedRows(PAGECODE.list_head);
	let noEdit = true;
	noEdit = rows.length > 0 ? false : noEdit;
	let noprint = noEdit;
	let commit = true;
	let uncommit = true;
	if (rows.length == 1) {
		rows.forEach((row) => {
			let bfrozen = row.data.values.bfrozen.value;
			if (bfrozen) {
				noprint = true;
			}
			let forderstatus = row.data.values.forderstatus.value;
			if (forderstatus == FIELD.free) {
				commit = false;
			} else if (forderstatus == FIELD.approve) {
				uncommit = false;
			}
		});
	} else if (rows.length > 1) {
		commit = false;
		uncommit = false;
	}
	let disableArr = {
		[LIST_BUTTON.Annex_Management]: noEdit,
		[LIST_BUTTON.QueryAboutBusiness]: noEdit,
		[LIST_BUTTON.Print]: noprint,
		[LIST_BUTTON.PrintCountQuery]: noprint,
		[LIST_BUTTON.Refresh]: noEdit,
		[LIST_BUTTON.Commit]: commit,
		[LIST_BUTTON.UnCommit]: uncommit,
		[LIST_BUTTON.ToInformation]: noEdit,
		[LIST_BUTTON.Refresh]: false
	};
	this.props.button.setDisabled(disableArr);
}

export default { getListRowButtons, initButtons, onSelectedButtons };
