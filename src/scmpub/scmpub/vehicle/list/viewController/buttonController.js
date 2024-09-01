/*
 * @Author: zhaochyu 
 * @PageInfo: 按钮控制
 * @Date: 2020-02-10 14:13:17 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-10-14 09:07:25
 */
import { AREA, STATUS, FILED } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
function setDeleteStatus() {
	let status = this.props.editTable.getStatus(AREA.listTable);
	if (status == STATUS.browse) {
		this.props.button.setPopContent(FILED.Delete, getLangByResId(this, '4001VEHICLE-000004')); /* 国际化处理： 确认要删除吗？*/
	} else {
		this.props.button.setPopContent(FILED.Delete);
	}
}
function setEditStatusButton() {
	this.setState({
		status: 'edit'
	});
	this.props.button.setButtonVisible([ 'Edit', 'Refresh', 'StartUse', 'StopUse', 'PrintPop', 'Output' ], false);
	this.props.button.setButtonVisible([ 'Add', 'Delete', 'Save', 'Cancel' ], true);
	this.props.button.setButtonDisabled([ 'Save', 'Cancel' ], false);
}
function setBrowseStatusButton() {
	this.props.button.setButtonVisible(
		[ 'Add', 'Delete', 'Edit', 'Refresh', 'StartUse', 'StopUse', 'PrintPop', 'Output' ],
		true
	);
	this.props.button.setButtonVisible([ 'Save', 'Cancel' ], false);
	this.setState({
		status: 'browse'
	});
}
/**
 * //根据勾选行控制肩部按钮
 * 
 *
 */
function lineSelected(props) {
	let rows = props.editTable.getCheckedRows(AREA.listTable);
	let trueFlag = true;
	// 初始化全部不可见
	let Delete = trueFlag;
	let StartUse = trueFlag;
	let StopUse = trueFlag;
	let PrintPop = trueFlag;
	let Output = trueFlag;
	//选择数据时，区分一条或者多选  只有选择数据的时候才控制按钮
	if (rows.length > 1) {
		//批量选择（删除，审批，取消审批按钮都可见）
		StartUse = false;
		StopUse = false;
		Output = false;
		PrintPop = false;
		Delete = false;
	} else if (rows.length == 1) {
		rows.map((item) => {
			let bsealflag = item.data.values.bsealflag.value;
			if (bsealflag == true) {
				StartUse = false;
				StopUse = true;
			} else if (bsealflag === false) {
				StartUse = true;
				StopUse = false;
			}
		});
		Delete = false;
		Output = false;
		PrintPop = false;
	}

	let disableArr = {
		Delete: Delete,
		StartUse: StartUse,
		StopUse: StopUse,
		PrintPop: PrintPop,
		Output: Output
	};
	props.button.setDisabled(disableArr);
}
export { setEditStatusButton, setBrowseStatusButton, lineSelected, setDeleteStatus };
