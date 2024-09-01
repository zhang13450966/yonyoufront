import { PAGEAREA, UISTATE } from '../constance';
import { getBusinessInfo } from 'nc-lightapp-front';
import { setButtonsEnable, viewController } from '../viewController';

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
	let rowCount = props.editTable.getNumberOfRows(PAGEAREA.list);

	props.editTable.addRow(PAGEAREA.list, undefined, true, {
		pk_org: { display: getBusinessInfo().groupName, value: getBusinessInfo().groupId },
		pk_group: { display: getBusinessInfo().groupName, value: getBusinessInfo().groupId }
	});
	//this.state.status = UISTATE.edit;
	viewController.call(this, props, UISTATE.edit);
}
