/*
 * @Author: liangzhyf 
 * @Date: 2019-04-16 16:09:07 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2019-07-22 10:51:02
 */
import { AREA, UISTATE } from '../constance';
import { setButtonsEnable, viewController } from '../viewController/index';

export default function(props) {
	if (this.state.status == UISTATE.browse) {
		this.setState(
			{
				status: UISTATE.edit
			},
			() => {
				setButtonsEnable.call(this, this.props, true);
			}
		);
	}
	let rowCount = props.editTable.getNumberOfRows(AREA.tableArea);
	props.editTable.addRow(AREA.tableArea, rowCount, true, {});
	viewController.call(this, props, UISTATE.edit);
	return;
}
