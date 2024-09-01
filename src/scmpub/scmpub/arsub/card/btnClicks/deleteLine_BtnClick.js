/*
 * @Author: 刘奇 
 * @PageInfo: 卡片表体行删除按钮
 * @Date: 2019-03-13 15:55:31 
 * @Last Modified by: 刘奇 
 * @Last Modified time: 2019-03-13 15:55:31 
 */

import { ARSUB_CONST } from '../../const';
import buttonController from '../viewController/buttonController';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props, record, index) {
	let selIndex = [];
	if (index == undefined) {
		let seldatas = props.cardTable.getCheckedRows(ARSUB_CONST.tableId);
		if (seldatas.length == 0) {
			showWarningInfo(null, getLangByResId(this, '4006ARSUB-000012')); /* 国际化处理： 请选择要删除的行！*/
		}
		seldatas.forEach((item) => {
			selIndex.push(item.index);
		});
	} else {
		selIndex.push(index);
	}

	setTimeout(() => {
		props.cardTable.delRowsByIndex(ARSUB_CONST.tableId, selIndex);
		buttonController.call(this, props);
	}, 0);
}
