/*
 * @Author: 刘奇 
 * @PageInfo:界面状态-按钮控制
 * @Date: 2018-12-25 15:40:52 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-18 16:45:35
 */
import { AREA, BUTTON, STATUS, FIELD } from '../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
function buttonControl(status) {
	// 1、设置页面状态
	setUIState.call(this, status); // 2、按钮状态控制
	setButtonState.call(this); // 3、主按钮设置
	setMainButton.call(this); // 4、返回按钮控件状态控制
	setHeadInfoState.call(this); // 5、卡片分页器状态控制
	setCardPaginationState.call(this);
}

function setUIState(status) {
	if (status) {
		this.props.editTable.setStatus(this.tableId, status);
		this.setState({});
	}
}

function setButtonState() {
	// this.props.button.setPopContent(BUTTON.deleteLine, getLangByResId(this, '4001BATCHCODE-000011'));
	// /* 国际化处理： 确认要删除该信息吗？*/

	//---------根据页面状态设置-------------------
	let tableStatus = this.props.editTable.getStatus(this.tableId);
	let tableflag = tableStatus === STATUS.edit ? true : false;
	//按钮显隐
	this.props.button.setButtonVisible([ BUTTON.edit, BUTTON.print, BUTTON.output, BUTTON.refresh ], !tableflag);
	this.props.button.setButtonVisible([ BUTTON.save, BUTTON.cancel ], tableflag);
	// this.props.button.setButtonVisible([ BUTTON.add, BUTTON.delete ], true);
	//设置查询区编辑性
	this.props.search.setDisabled(this.searchId, tableflag);
	//设置删除提示的显示隐藏
	if (tableflag) {
		this.props.button.setPopContent(BUTTON.deleteLine, '');
	} else {
		this.props.button.setPopContent(BUTTON.deleteLine, getLangByResId(this, '4001BATCHCODE-000011'));
		/* 国际化处理： 确认要删除该信息吗？*/
	}
	//---------根据是否选中行设置按钮可用性-------------------
	let selectLength = this.props.editTable.getCheckedRows(this.tableId).length;
	let selectFlag = selectLength > 0 ? false : true;
	this.props.button.setDisabled({
		[BUTTON.delete]: selectFlag,
		[BUTTON.print]: selectFlag,
		[BUTTON.output]: selectFlag
	});
	//---------根据是否有数据设置按钮可用性-------------------
	let allLength = this.props.editTable.getAllRows(this.tableId, true).length;
	let editflag = allLength > 0 ? false : true;
	this.props.button.setDisabled({
		[BUTTON.edit]: editflag
	});
	this.props.editTable.selectAllRows(this.tableId, false);

	//如果有查询缓存则刷新按钮可用
	if (getDefData(AREA.dataSource, FIELD.queryInfo)) {
		this.props.button.setDisabled({
			[BUTTON.refresh]: false
		});
	}
}

function setMainButton() {}

function setHeadInfoState() {}

function setCardPaginationState() {}

export { buttonControl };
