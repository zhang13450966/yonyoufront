import { ARRIVEPLAN, LIST_BUTTON, STATUS } from '../../constance';

/**
 * 根据页面状态，修改编辑态表格
 * @param {*} props 
 * @param {*} status 
 */
function togglePageShow(props, status) {
	let flag = true;
	if (status === STATUS.browse) {
		flag = false;
		props.editTable.hideColByKey(ARRIVEPLAN.TABLEID, 'opr');
	} else {
		props.editTable.setStatus(ARRIVEPLAN.TABLEID, STATUS.edit);
		props.editTable.showColByKey(ARRIVEPLAN.TABLEID, 'opr');
	}
	//edit
	props.button.setButtonVisible([ LIST_BUTTON.Add, LIST_BUTTON.Delete, LIST_BUTTON.Cancel, LIST_BUTTON.Save ], flag);
	//browse
	props.button.setButtonVisible(
		[ LIST_BUTTON.Edit, LIST_BUTTON.SMS_CIRCULAR, LIST_BUTTON.Print, LIST_BUTTON.Refresh ],
		!flag
	);
	let check = props.editTable.getCheckedRows(ARRIVEPLAN.TABLEID);
	let isshowdel = check.length > 0 ? false : true;
	let rowNumbers = props.editTable.getNumberOfRows(ARRIVEPLAN.TABLEID);
	let disabled = rowNumbers > 0 ? false : true;
	props.button.setDisabled([ LIST_BUTTON.Print ], disabled);
	props.button.setDisabled([ LIST_BUTTON.Delete ], isshowdel);
	props.editTable.setStatus(ARRIVEPLAN.TABLEID, status);
}

/**
 * 按钮状态初始化
 */
function initButtonVisible() {
	let flag = true;
	this.props.button.setButtonsVisible({
		[LIST_BUTTON.Edit]: flag,
		[LIST_BUTTON.SMS_CIRCULAR]: flag,
		[LIST_BUTTON.Print]: flag,
		[LIST_BUTTON.Refresh]: flag,
		[LIST_BUTTON.Add]: !flag,
		[LIST_BUTTON.Delete]: !flag,
		[LIST_BUTTON.Save]: !flag,
		[LIST_BUTTON.Cancel]: !flag
	});
}

/**
 * 勾选事件
 */
function selectedChange() {
	let rows = this.props.editTable.getCheckedRows(ARRIVEPLAN.TABLEID);
	let disable = rows.length > 0 ? false : true;
	this.props.button.setDisabled([ LIST_BUTTON.Print, LIST_BUTTON.Delete ], disable);
}

export default { togglePageShow, initButtonVisible, selectedChange };
