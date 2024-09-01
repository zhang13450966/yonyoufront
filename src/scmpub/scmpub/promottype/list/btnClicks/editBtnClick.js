import { AREA, UISTATE } from '../constance/index';
import { viewController, setButtonsEnable } from '../viewController';
export default function(props, index) {
	props.editTable.selectAllRows(AREA.tableArea, false);
	this.setState(
		{
			status: UISTATE.edit
		},
		() => {
			setButtonsEnable.call(this, props, true);
		}
	);
	viewController.call(this, props, UISTATE.edit);
}
