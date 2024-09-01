/*
 * @Author: zhangchqf 
 * @PageInfo: 删行操作 
 * @Date: 2020-03-20 10:02:58 
 * @Last Modified by: zhangchqf 
 * @Last Modified time: 2020-03-20 10:02:58 
 */

import { TARGETBILL_CONST } from '../../const';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import selectBox_BtnClick from './selectBox_BtnClick';

export default function buttonClick(props, record, index) {
	let selIndex = [];
	// 点击的肩部按钮
	if (index == undefined) {
		let seldatas = props.cardTable.getCheckedRows(TARGETBILL_CONST.tableId);
		if (seldatas.length == 0) {
			showWarningInfo(null, getLangByResId(this, '4030ADJUSTDISCOUNT-000012')); /* 国际化处理： 请选择要删除的行！*/
		}
		seldatas.forEach((item) => {
			selIndex.push(item.index);
		});
	} else {
		selIndex.push(index);
	}
	props.cardTable.delRowsByIndex(TARGETBILL_CONST.tableId, selIndex);
	selectBox_BtnClick.call(this);
}
