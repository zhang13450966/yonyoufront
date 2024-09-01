import { AREA, BTNID, UISTATE } from '../constance/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

function viewController(props, status = UISTATE.browse) {
	props.editTable.setStatus(AREA.tableArea, status);
	buttonController.call(this, props, status);
}

function buttonController(props, status = UISTATE.browse) {
	if (status == UISTATE.browse) {
		//浏览态按钮状态
		let visableBtns = {
			[BTNID.save]: false,
			[BTNID.cancel]: false,
			[BTNID.add]: true,
			[BTNID.edit]: true,
			[BTNID.del]: true,
			[BTNID.print]: true,
			[BTNID.refresh]: true
		};
		props.button.setButtonsVisible(visableBtns);
		props.button.setPopContent(BTNID.del, getLangByResId(this, '4001PROMOTTYPE-000006')); /* 国际化处理： 确定要删除吗*/
	} else if (status == UISTATE.edit) {
		//编辑态按钮状态
		let visableBtns = {
			[BTNID.save]: true,
			[BTNID.cancel]: true,
			[BTNID.add]: true,
			[BTNID.edit]: false,
			[BTNID.del]: true,
			[BTNID.print]: false,
			[BTNID.refresh]: false
		};
		props.button.setButtonsVisible(visableBtns);
		props.button.setPopContent(BTNID.del);
	}
}

/**
 * 控制按钮可不可用
 * @param {*} props 
 */
function setButtonsEnable(props, flag) {
	const { button } = props;
	const { setButtonDisabled } = button;
	let rows = flag ? props.editTable.getAllRows(AREA.tableArea, true) : null;
	if (!rows || Object.keys(rows).length == 0 || rows.length == 0) {
		//如果没有数据 修改删除打印输出不可用
		setButtonDisabled([ BTNID.edit, BTNID.del, BTNID.print, BTNID.output ], true);
	} else {
		//如果有数据 修改删除打印输出可用
		setButtonDisabled([ BTNID.edit, BTNID.del, BTNID.print, BTNID.output ], false);
		let checkedrows = props.editTable.getCheckedRows(AREA.tableArea);
		//如果行被勾选删除可用
		if (checkedrows && Object.keys(checkedrows).length > 0) {
			setButtonDisabled([ BTNID.del, BTNID.print, BTNID.output ], false);
		} else {
			setButtonDisabled([ BTNID.del, BTNID.print, BTNID.output ], true);
		}
	}
}

export { buttonController, viewController, setButtonsEnable };
