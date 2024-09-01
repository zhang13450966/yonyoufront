/*
 * @Author: 王龙华 
 * @PageInfo: 按钮的状态控制
 * @Date: 2018-12-26 20:11:16 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-05-17 17:47:53
 */
import { INVSOURCE_CONST, INVSOURCE_BUTTONS } from '../../const';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props, status) {
	let isBrowse = status === INVSOURCE_CONST.BROWSER_STATUS;
	//1.设置界面状态
	setUIState.call(this, props, status);
	// 2.设置按钮的显示隐藏
	setTableButtonVisiable.call(this, props, isBrowse);
	// 3.设置按钮可用性
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
			[INVSOURCE_BUTTONS.Edit]: true,
			[INVSOURCE_BUTTONS.Save]: false,
			[INVSOURCE_BUTTONS.Cancel]: false,
			[INVSOURCE_BUTTONS.Print]: true,
			[INVSOURCE_BUTTONS.Refresh]: true,
			[INVSOURCE_BUTTONS.Import]: true,
			[INVSOURCE_BUTTONS.Export]: true
		});
		props.button.setPopContent(
			INVSOURCE_BUTTONS.Delete,
			getLangByResId(this, '4001INVSOURCE-000000')
		); /* 国际化处理： 确认要删除该信息吗？*/
		props.search.setDisabled(INVSOURCE_CONST.SEARCHID, false);
		this.setState({ searchShow: true });
	} else {
		// 新增态按钮控制
		props.button.setButtonsVisible({
			[INVSOURCE_BUTTONS.Edit]: false,
			[INVSOURCE_BUTTONS.Save]: true,
			[INVSOURCE_BUTTONS.Cancel]: true,
			[INVSOURCE_BUTTONS.Print]: false,
			[INVSOURCE_BUTTONS.Refresh]: false,
			[INVSOURCE_BUTTONS.Import]: false,
			[INVSOURCE_BUTTONS.Export]: false
		});
		props.button.setPopContent(INVSOURCE_BUTTONS.Delete, '');
		props.search.setDisabled(INVSOURCE_CONST.SEARCHID, true);
		this.setState({ searchShow: false });
	}
}

/**
 * 控制按钮可用性
 * @param {*} props 
 * @param {*} status 
 */
function setTableButtonEnable(props) {
	props.editTable.selectAllRows(INVSOURCE_CONST.TABLEID, false);
	let len = props.editTable.getAllRows(INVSOURCE_CONST.TABLEID, true).length;
	if (len > 0) {
		props.button.setDisabled({
			[INVSOURCE_BUTTONS.Edit]: false,
			[INVSOURCE_BUTTONS.Save]: false,
			[INVSOURCE_BUTTONS.Cancel]: false,
			[INVSOURCE_BUTTONS.Print]: false
		});
	} else if (len == 0) {
		props.button.setDisabled({
			[INVSOURCE_BUTTONS.Edit]: true,
			[INVSOURCE_BUTTONS.Save]: true,
			[INVSOURCE_BUTTONS.Cancel]: true,
			[INVSOURCE_BUTTONS.Print]: true
		});
	}
	props.button.setDisabled({ [INVSOURCE_BUTTONS.Refresh]: !this.isSearched });
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status 
 */
function setUIState(props, status) {
	props.editTable.setStatus(INVSOURCE_CONST.TABLEID, status);
	this.setState({});
}

export { setTableButtonEnable };
