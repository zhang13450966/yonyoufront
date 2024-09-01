import buttonController from './buttonController';
import viewController from './viewController';
import { PAGEAREA, BUTTONS } from '../constance/index';

/**
 * 控制按钮可不可用
 * @param {*} props 
 */
function setButtonsEnable(props, flag) {
	const { button } = props;
	const { setButtonDisabled } = button;
	let checkedrows = flag ? props.editTable.getCheckedRows(PAGEAREA.list) : null;
	let rows = flag ? props.editTable.getAllRows(PAGEAREA.list, true) : null;

	if (!rows || Object.keys(rows).length == 0 || rows.length == 0) {
		//如果没有有数据 修改删除打印批改不可用
		setButtonDisabled([ BUTTONS.Edit, BUTTONS.Delete, BUTTONS.Print, BUTTONS.Output ], true);
	} else {
		setButtonDisabled([ BUTTONS.Edit, BUTTONS.Delete ], false);
		//如果行被勾选打印和批改可用
		if (checkedrows && Object.keys(checkedrows).length > 0) {
			setButtonDisabled([ BUTTONS.Print, BUTTONS.Output, BUTTONS.Delete ], false);
		} else {
			setButtonDisabled([ BUTTONS.Print, BUTTONS.Output, BUTTONS.Delete ], true);
		}
	}
}
export { buttonController, viewController, setButtonsEnable };
