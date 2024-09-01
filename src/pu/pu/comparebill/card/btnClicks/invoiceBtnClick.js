/*
 * @Author: qishy 
 * @PageInfo:卡片附件按钮
 * @Date: 2019-04-29 15:38:42 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-06-17 14:29:27
 */
import { AREA, FIELDS, REQUESTURL, BILLSTATUS } from '../../constance';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let checkedRows = props.cardTable.getCheckedRows(AREA.cardTableId);
	if (checkedRows.length == 0) {
		return;
	}
	if (props.form.getFormItemsValue(AREA.cardFormId, FIELDS.forderstatus).value != BILLSTATUS.confirm) {
		showErrorInfo(null, getLangByResId(this, '4004comarebill-000034') /* 国际化处理：非确认状态单据不能生成发票*/);
		return;
	}

	let head = {
		pk: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_comparebill).value,
		ts: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.ts).value
	};
	let bodys = [];
	checkedRows.forEach((checkedRow) => {
		let values = checkedRow.data.values;
		// 过滤不能收票的行
		if (!values.bcollectclose.value) {
			bodys.push({
				pk: values[FIELDS.pk_comparebill_b].value,
				ts: values[FIELDS.ts].value
			});
		}
	});

	if (bodys.length == 0) {
		showErrorInfo(null, getLangByResId(this, '4004comarebill-000035') /* 国际化处理：所选行都不能生成发票*/);
		return;
	}

	let data = {
		data: [
			{
				head: head,
				bodys: bodys
			}
		]
	};

	props.openTo(null, {
		appcode: '400401600',
		pagecode: '400401600_card',
		idInfo: JSON.stringify(data),
		channelType: 'from2507'
	});
}
