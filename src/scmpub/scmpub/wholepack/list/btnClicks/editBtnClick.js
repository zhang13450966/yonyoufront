import { UISTATE } from '../constance';
import { viewController } from '../viewController';
export default function(props, record) {
	this.state.status = UISTATE.edit;
	viewController.call(this, props, UISTATE.edit);
}
