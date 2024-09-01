import { addBtnClick } from '../btnClicks/addBtnClick';
import { deleteBtnClick } from '../btnClicks/deleteBtnClick';
import { cancelBtnClick } from '../btnClicks/cancelBtnClick';
import { refreshBtnClick } from '../btnClicks/refreshBtnClick';
import { EditBtnClick } from '../btnClicks/editBtnClick';
import { queryBtnClick } from '../btnClicks/queryBtnClick';
import { SaveBtnClick } from '../btnClicks/saveBtnClick';
import { startuseBtnClick } from '../btnClicks/startuseBtnClick';
import { stopuseBtnClick } from '../btnClicks/stopuseBtnClick';
import { printBtnClick } from '../btnClicks/printBtnClick';
import { FILED } from '../../constance';
//import { showQuitTransferWarningDialog } from '../../../pub/tool/messageUtil';
export default function buttonClick(props, key, record, index, flag) {
	switch (key) {
		case FILED.Add: // 自制
			addBtnClick.call(this, props);
			break;
		case FILED.Delete:
			deleteBtnClick.call(this, props, record, index);
			break;
		case FILED.Cancel:
			cancelBtnClick.call(this);
			break;
		case FILED.Refresh:
			refreshBtnClick.call(this);
			break;
		case FILED.showOff:
			let check = this.state.checked;
			this.setState({ checked: !check });
			queryBtnClick.call(this);
			break;
		case FILED.Edit:
			EditBtnClick.call(this, props, record, index);
			break;
		case FILED.Save:
			SaveBtnClick.call(this);
			break;
		case FILED.StartUse:
			startuseBtnClick.call(this, index, record);
			break;
		case FILED.StopUse:
			stopuseBtnClick.call(this, index, record);
			break;
		case FILED.PrintPop:
			printBtnClick.call(this, this.props);
			break;
		case FILED.Output:
			printBtnClick.call(this, this.props, true);
			break;
	}
}
