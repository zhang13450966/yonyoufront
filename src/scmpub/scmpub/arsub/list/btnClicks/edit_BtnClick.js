/*
 * @Author: 王龙华 
 * @PageInfo: 客户费用单列表下修改
 * @Date: 2018-06-05 13:59:51 
 * @Last Modified by: zhangllb
 * @Last Modified time: 2022-06-15 14:32:07
 */

import { ARSUB_CONST, ArsubHeadItem, BUTTON } from '../../const';
import { ajax } from 'nc-lightapp-front';
export default function edit_BtnClick(props, record, index) {
	let id = record[ArsubHeadItem.carsubid].value;
	let data = {
		pks: [ id ]
	};
	ajax({
		url: ARSUB_CONST.arsubEditUrl,
		data: data,
		success: (res) => {
			props.pushTo(ARSUB_CONST.Card_URL, {
				status: ARSUB_CONST.edit,
				id: record[ArsubHeadItem.carsubid].value,
				buttonType: BUTTON.edit,
				pagecode: ARSUB_CONST.cardPageId
			});
		}
	});
}
