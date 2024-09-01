import { addBtnClick } from '../btnClicks/addBtnClick';
import { deleteBtnClick } from '../btnClicks/deleteBtnClick';
import { cancelBtnClick } from '../btnClicks/cancelBtnClick';
import { refreshBtnClick } from '../btnClicks/refreshBtnClick';
import { EditBtnClick } from '../btnClicks/editBtnClick';
import { SaveBtnClick } from '../btnClicks/saveBtnClick';
import { startuseBtnClick } from '../btnClicks/startuseBtnClick';
import { stopuseBtnClick } from '../btnClicks/stopuseBtnClick';
import { printBtnClick } from '../btnClicks/printBtnClick';
import { rowdeleteBtnClick } from '../btnClicks/rowdeleteBtnClick';
import { FILED } from '../../constance';
import {showWarningDialog} from "../../../pub/tool/messageUtil";
import {getLangByResId} from "../../../pub/tool/multiLangUtil";
export default function buttonClick(props, key, text, record, index) {
	switch (key) {
		case FILED.Add: // 自制
			addBtnClick.bind(this, props)();
			break;
		case FILED.Delete:

			// 删除操作先弹框让确认后再走逻辑
			// showWarningDialog(getLangByResId(this, '4001VEHICLE-000003'), getLangByResId(this, '4001VEHICLE-000004'), {
			// 	/* 国际化处理： 停用,确定要停用吗？*/
			// 	beSureBtnClick: () => {
			// 		if (record) {
			// 			rowdeleteBtnClick.call(this, props, record, index);
			// 		} else {
			// 			deleteBtnClick.call(this);
			// 		}
			// 	}
			// });
			//车辆定义-组织，点肩部删除，弹了两次确认框
			if (record) {
				rowdeleteBtnClick.call(this, props, record, index);
			} else {
				deleteBtnClick.call(this);
			}



			break;
		case FILED.Cancel:
			cancelBtnClick.call(this);
			break;
		case FILED.Refresh:
			refreshBtnClick.call(this);
			break;
		case FILED.Edit:
			EditBtnClick.call(this, true);
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
