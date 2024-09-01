/*
 * @Author: 刘奇 
 * @PageInfo: 卡片修改按钮点击事件
 * @Date: 2019-03-18 16:06:01 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2019-11-28 15:54:14
 */
import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem, BUTTON } from '../../const';
import buttonController from '../viewController/buttonController';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';

export default function buttonClick(props) {
	props.cardTable.selectAllRows(ARSUB_CONST.tableId, false);

	let id = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value;
	let data = {
		pks: [ id ]
	};
	ajax({
		url: ARSUB_CONST.arsubEditUrl,
		data: data,
		success: (res) => {
			let buttonType = this.props.getUrlParam('buttonType');
			if (buttonType != null && buttonType.indexOf('ref') != -1) {
				changeUrlParam(props, {
					status: ARSUB_CONST.edit,
					id: id
				});
			} else {
				changeUrlParam(props, {
					status: ARSUB_CONST.edit,
					id: id,
					buttonType: BUTTON.edit
				});
			}

			buttonController.call(this, props);
		}
	});
}
