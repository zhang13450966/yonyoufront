/*
 * @Author: 刘奇 
 * @PageInfo: 卡片表体行删除按钮
 * @Date: 2019-03-13 15:55:31 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2020-02-28 10:40:14
 */
import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST } from '../../const';
import buttonController from '../viewController/buttonController';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props, record, index) {
	let selIndex = [];
	if (index == undefined) {
		let seldatas = props.cardTable.getCheckedRows(PREPAIDINVOICE_CONST.tableId);
		if (seldatas.length == 0) {
			showWarningInfo(null, getLangByResId(this, '4006PREPAIDINVOICE-000012')); /* 国际化处理： 请选择要删除的行！*/
		}
		seldatas.forEach((item) => {
			selIndex.push(item.index);
		});
	} else {
		selIndex.push(index);
	}
	//add by huoyzh 删除表体，更行表头的价税合计
	let prepaidinvo = props.createMasterChildData(
		PREPAIDINVOICE_CONST.cardPageId,
		PREPAIDINVOICE_CONST.formId,
		PREPAIDINVOICE_CONST.tableId
	);
	let info = {
		rows: selIndex,
		type: 'DelLine',
		bill: prepaidinvo
	};
	ajax({
		url: PREPAIDINVOICE_CONST.deletebody,
		data: info,
		success: (res) => {
			if (res.data.canDel) {
				// 可以删除行
				setTimeout(() => {
					props.form.setAllFormValue({
						[PREPAIDINVOICE_CONST.formId]: res.data.headvo[PREPAIDINVOICE_CONST.formId]
					});
					props.cardTable.delRowsByIndex(PREPAIDINVOICE_CONST.tableId, selIndex);
					buttonController.call(this, props);
				}, 0);
			} else {
				showWarningInfo(null, res.data.msg);
			}
		}
	});
}
