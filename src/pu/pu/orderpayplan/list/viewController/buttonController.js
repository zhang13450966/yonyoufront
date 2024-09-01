import { Button } from 'antd-mobile';
import { PAGECODE, BUTTON, STATUS, FIELD } from '../../constance';

/**
 * 根据页面状态，修改编辑态表格
 * @param {*} props
 * @param {*} status
 */
function togglePageShow(props, status) {
	let flag = true;
	if (status === STATUS.browse) {
		flag = false;
		// props.editTable.hideColByKey(PAGECODE.tableId, 'opr');
	}
	//edit
	props.button.setButtonVisible([ BUTTON.Add, BUTTON.Delete, BUTTON.Cancel, BUTTON.Save ], flag);
	//browse
	props.button.setButtonVisible(
		[
			BUTTON.Edit,
			BUTTON.UnionQueryGroup,
			BUTTON.UnionQueryDetailed,
			BUTTON.GeneratePaymentApplication,
			BUTTON.Payment,
			BUTTON.QueryAboutBusiness,
			BUTTON.Print,
			BUTTON.Refresh
		],
		!flag
	);
	props.editTable.setStatus(PAGECODE.tableId, status);
	let disableArr = {
		[BUTTON.Add]: !flag
	};
	props.button.setDisabled(disableArr);
}

/**
 * 列表行操作按钮
 */
function getPayMentRowButtons() {
	return [ BUTTON.List_Inner_Insert, BUTTON.List_Inner_Delete, BUTTON.List_Inner_Copy ];
}

/**
 * 列表按钮初始化
 * @param {*} flag
 */
function initButton(flag) {
	let disableArr = {
		[BUTTON.Edit]: flag,
		[BUTTON.Add]: flag,
		[BUTTON.Refresh]: flag,
		[BUTTON.UnionQueryGroup]: flag,
		[BUTTON.UnionQueryDetailed]: flag,
		[BUTTON.GeneratePaymentApplication]: flag, //生成付款申请
		[BUTTON.Payment]: flag, //付款
		[BUTTON.QueryAboutBusiness]: flag, //单据追溯
		[BUTTON.Print]: flag, //打印
		[BUTTON.Delete]: flag //删除
	};
	this.props.button.setDisabled(disableArr);
}

/**
 * 页面勾选事件
 * @param {*} props
 */
function onSelectButton(props) {
	let rows = props.editTable.getCheckedRows(PAGECODE.tableId);
	let flag = true;
	if (rows && rows.length > 0) {
		flag = false;
	}
	let noprint = flag;
	if (rows.length == 1) {
		rows.forEach((row) => {
			// let bfrozen = row.data.values.bfrozen.value;
			let pk_order = row.data.values[FIELD.pk_order].value;
			let bfrozen = this.frozen[pk_order];
			if (bfrozen == 'N' || bfrozen == undefined) {
				noprint = false;
			} else {
				noprint = true;
			}
		});
	}
	let disableArr = {
		[BUTTON.UnionQueryGroup]: flag,
		[BUTTON.UnionQueryDetailed]: flag,
		[BUTTON.GeneratePaymentApplication]: flag, //生成付款申请
		[BUTTON.Payment]: flag, //付款
		[BUTTON.QueryAboutBusiness]: flag, //单据追溯
		[BUTTON.Print]: noprint, //打印
		[BUTTON.Delete]: flag
	};
	props.button.setDisabled(disableArr);
}

/**
 * 取消按钮事件
 */
function cancelBtn() {
	let disableArr = {
		[BUTTON.GeneratePaymentApplication]: true, //生成付款申请
		[BUTTON.Payment]: true, //付款
		[BUTTON.QueryAboutBusiness]: true, //单据追溯
		[BUTTON.Print]: true //打印
	};
	this.props.button.setDisabled(disableArr);
}

/**
 * 数据加载后处理
 * @param {*} props
 */
function pageinfoinit(props) {
	let disableArr = {
		[BUTTON.Edit]: false,
		[BUTTON.Refresh]: false
	};
	props.button.setDisabled(disableArr);
}

export default { togglePageShow, getPayMentRowButtons, initButton, onSelectButton, cancelBtn, pageinfoinit };
