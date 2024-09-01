import { BUTTON_ID, DATASOURCE, FIELD } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function(props, checkArr) {
	let queryInfo = getDefData(DATASOURCE.LIST, FIELD.QRYINFO);
	// 刷新按钮
	props.button.setDisabled({
		[BUTTON_ID.Refresh]: queryInfo ? false : true
	});
	// 打印
	if (!checkArr || checkArr.length == 0) {
		props.button.setDisabled({ [BUTTON_ID.Print]: true });
	} else {
		props.button.setDisabled({ [BUTTON_ID.Print]: false });
	}
}
