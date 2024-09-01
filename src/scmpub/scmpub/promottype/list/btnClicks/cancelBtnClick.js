import commonSearch from './commonSearch';
import { AREA, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(props) {
	showCancelDialog({
		beSureBtnClick: celEdit.bind(this, props)
	});
}
function celEdit(props) {
	props.editTable.cancelEdit(AREA.tableArea);
	this.setState({
		status: UISTATE.browse
	});
	commonSearch.call(this, this.props);
	viewController.call(this, props, UISTATE.browse);
}
