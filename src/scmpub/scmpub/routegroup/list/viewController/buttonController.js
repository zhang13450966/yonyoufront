/*
 * @Author: 王勇 
 * @PageInfo: 列表-按钮状态 控制  
 * @Date: 2020-01-17 09:53:20 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-09 17:35:44
 */
import { VIEWINFO, BUTTONINFO, QUERYAREAINFO, TEMPLATEINFO } from '../../const/index';
export default function(props, status) {
	let isBrowse = status === VIEWINFO.BROWSER_STATUS;
	// 设置按钮的显示隐藏
	setTableButtonVisiable.call(this, props, isBrowse);
	// 设置按钮可用性
	setTableButtonEnable.call(this, props);
}

/**
 * 控制按钮可见性
 * @param {*} props 
 * @param {*} status 
 */
function setTableButtonVisiable(props, isBrowse) {
	if (isBrowse) {
		props.button.setButtonsVisible({
			[BUTTONINFO.editBtnCode]: true,
			[BUTTONINFO.printBtnCode]: true,
			[BUTTONINFO.outputBtnCode]: true,
			[BUTTONINFO.refreshBtnCode]: true
		});
		// props.button.setPopContent(
		// 	BUTTONINFO.innerDelBtnCode,
		// 	getLangByResId(this, '4001ROUTE-000003')
		// ); /* 国际化处理： 确认要删除该信息吗？*/
		props.search.setDisabled(QUERYAREAINFO.areaCode, false);
	} else {
		// 新增态按钮控制
		props.button.setButtonsVisible({
			[BUTTONINFO.editBtnCode]: false,
			[BUTTONINFO.printBtnCode]: false,
			[BUTTONINFO.outputBtnCode]: false,
			[BUTTONINFO.refreshBtnCode]: false
		});
		props.button.setPopContent(BUTTONINFO.innerDelBtnCode, '');
		props.search.setDisabled(QUERYAREAINFO.areaCode, true);
	}
}

/**
 * 控制按钮可用性
 * @param {*} props 
 * @param {*} status 
 */
function setTableButtonEnable(props) {
	// props.editTable.selectAllRows(TEMPLATEINFO.areaCode, false);
	let len = props.table.getAllTableData(TEMPLATEINFO.listAreaCode).rows.length;
	if (len > 0) {
		props.button.setDisabled({
			[BUTTONINFO.editBtnCode]: false
		});
	} else if (len == 0) {
		props.button.setDisabled({
			[BUTTONINFO.editBtnCode]: true
		});
	}
	// props.button.setDisabled({[ BUTTONINFO.refreshBtnCode ]:!this.isSearched});
}
