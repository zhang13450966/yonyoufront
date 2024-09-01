import { PAGEAREA, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { getBusinessInfo } from 'nc-lightapp-front';
import { buttonController } from '../../../backreason/list/viewController/index';
export default function(props) {
	if (this.state.status == UISTATE.browse) {
		this.setState(
			{
				status: UISTATE.edit
			},
			() => {
				buttonController.call(this, this.props, true);
			}
		);
	}

	props.editTable.addRow(PAGEAREA.list, undefined, true, {
		pk_group: { display: getBusinessInfo().groupName, value: getBusinessInfo().groupId }
	});
	//this.state.status = UISTATE.edit;
	viewController.call(this, props, UISTATE.edit);
}
