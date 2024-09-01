/*
 * 按钮控制器 
 * @Author: zhngzh 
 * @Date: 2019-04-28 10:21:42 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 11:04:53
 */
import { BUTTONS, UISTATE, PAGEAREA } from '../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props, status = UISTATE.browse) {
	if (status == UISTATE.browse) {
		//浏览态按钮状态
		let visibleBtns = {
			[BUTTONS.Edit]: true,
			[BUTTONS.Print]: true,
			[BUTTONS.Add]: true,
			[BUTTONS.Delete]: true,
			[BUTTONS.Refresh]: true,
			[BUTTONS.Save]: false,
			[BUTTONS.Cancel]: false
		};
		props.button.setButtonsVisible(visibleBtns);
		props.button.setPopContent(BUTTONS.Delete, getLangByResId(this, '4001PACKINGTYPE-000011')); /* 国际化处理： 确定要删除吗？*/
	} else if (status == UISTATE.edit) {
		//编辑态按钮状态
		let visibleBtns = {
			[BUTTONS.Edit]: false,
			[BUTTONS.Print]: false,
			[BUTTONS.Add]: true,
			[BUTTONS.Delete]: true,
			[BUTTONS.Refresh]: false,
			[BUTTONS.Save]: true,
			[BUTTONS.Cancel]: true
		};
		props.button.setButtonsVisible(visibleBtns);
		props.button.setPopContent(BUTTONS.Delete);
	}
	setButtonsEnable.call(this, props, status);
}
/**
 * 控制按钮可不可用
 * @param {*} props 
 */
function setButtonsEnable(props) {
	//选中控制
	let selectRows = props.editTable.getCheckedRows(PAGEAREA.list);
	let selectflag = selectRows.length > 0 ? false : true;
	props.button.setButtonDisabled({
		[BUTTONS.Delete]: selectflag,
		[BUTTONS.Print]: selectflag,
		[BUTTONS.Output]: selectflag
	});

	//当没有数据的时候编辑不可用
	let rows = props.editTable.getNumberOfRows(PAGEAREA.list);
	let rowflag = rows > 0 ? false : true;
	props.button.setButtonDisabled({
		[BUTTONS.Edit]: rowflag
	});
}
