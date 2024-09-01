/*
 * @Author: zhaochyu
 * @PageInfo: 主组织编辑后事件
 * @Date: 2018-04-15 14:41:59
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-30 15:50:42
 */

import { ajax } from 'nc-lightapp-front';
import { AREA, STATUS, FILED, URL, HEADFILED, PAGEID } from '../../constance';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { removeAllTableData } from '../btnClick/setAllTableData';
export default function afterEvent(props, moduleId, key, value, before) {
	if (before && !before.value && value && value.value) {
		if (before.value == value.value) return;
		props.form.setFormItemsValue(AREA.card_head, {
			[HEADFILED.pk_org]: {
				value: value.values.pk_trafficorg.value,
				scale: '-1',
				display: value.display
			}
		});
		props.resMetaAfterPkorgEdit();
	} else if (before.value != value.value) {
		// 执行切换主组织事件
		showWarningDialog(getLangByResId(this, '4001CARRIER--000001'), getLangByResId(this, '4001CARRIER-000000'), {
			/* 国际化处理： 确认修改，确认要修改组织？这样会清空您录入的信息！*/
			beSureBtnClick: SwitchFunction.bind(this, {
				props: props,
				moduleId: moduleId,
				key: key,
				value: value,
				before: before
			}),
			cancelBtnClick: () => {
				props.form.setFormItemsValue(AREA.card_head, {
					[FILED.org]: {
						value: before.value,
						display: before.display
					}
				});
			}
		});
	}
}
//切换主组织
function SwitchFunction(params) {
	let { props, moduleId, key, value, before } = params;
	props.form.EmptyAllFormValue(AREA.card_head);
	removeAllTableData.call(this);
	let status = props.getUrlParam(FILED.cardStatus);
	props.form.setFormStatus(AREA.card_head, STATUS.edit);
	props.cardTable.setStatus(AREA.card_body, STATUS.edit);
	if (status == STATUS.edit || status == STATUS.add) {
		props.initMetaByPkorg('pk_org_v');
	}
	if (value !== null && value.value !== null && value.value !== '') {
		//获取表体行数量
		// if (copy == null) {
		// 	let rows = null;
		// 	if (props.cardTable.getNumberOfRows(AREA.card_body)) {
		// 		rows = props.cardTable.getNumberOfRows(AREA.card_body);
		// 	}
		// 	for (let ii = 0; ii < rows; ii++) {
		// 		props.cardTable.delRowsByIndex(AREA.card_body, 0);
		// 	}
		// 	props.cardTable.addRow(AREA.card_body);
		// 	RownoUtils.setRowNo(props, FILED.cardTable, ATTRCODES.crowno);
		// }
		//获取表单编辑后数据
		let data = createHeadAfterEventData(
			props,
			PAGEID.cardpagecodeorg,
			AREA.card_head,
			AREA.driver,
			moduleId,
			key,
			value
		);
		data.card.head.card_head.rows[0].values.pk_org_v = {
			value: data.newvalue.value
		};
		data.oldvalue = before;
		data.areacode = AREA.card_head;
		let pk_org_vValue = data.newvalue.value;
		let pk_org_Display = data.newvalue.display;
		ajax({
			url: URL.headafter,
			data: data,
			success: (res) => {
				//表头赋值
				if (res.data && res.data.head && res.data.head.card_head) {
					processBillCardHeadEditResult(props, AREA.card_head, AREA.card_body, res.data);
					props.form.setFormItemsValue(AREA.card_head, {
						[HEADFILED.pk_org_v]: {
							value: pk_org_vValue,
							scale: '-1',
							display: pk_org_Display
						}
					});
					props.form.setFormItemsValue(AREA.card_head, {
						[HEADFILED.pk_org]: {
							value: res.data.head.card_head.rows[0].values.pk_org.value,
							scale: '-1',
							display: res.data.head.card_head.rows[0].values.pk_org.display
						}
					});
					props.resMetaAfterPkorgEdit();
					props.cardTable.setStatus(AREA.card_body, STATUS.edit);
				}
			}
		});
	} else {
		buttonController.lineSelected.call(this, this.props, true);
	}
}
