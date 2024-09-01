/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，卡片，修改按钮
 * @Date: 2021-11-23 21:14:51 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-14 14:41:47
 */

import { ajax } from 'nc-lightapp-front';
import { URL, AREA, UISTATE, OHTER, FIELD } from '../../constance';
import { buttonController } from '../viewController';
export default function editBtnClick(props) {
	let pk = props.form.getFormItemsValue(AREA.head, FIELD.hid).value;
	let info = { actioncode: 'edit', pks: [ pk ] };
	ajax({
		url: URL.permission,
		data: info,
		method: 'post',
		success: (res) => {
			props.cardTable.selectAllRows(AREA.body, false);
			props.setUrlParam({ [OHTER.status]: UISTATE.edit });
			this.status = UISTATE.edit;
			buttonController.call(this, props);
		}
	});
}
