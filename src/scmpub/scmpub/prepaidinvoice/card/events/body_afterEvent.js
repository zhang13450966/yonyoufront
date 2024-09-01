/*
 * @Author: 刘奇 
 * @PageInfo: 卡片表体编辑事件   
 * @Date: 2019-03-12 14:43:23 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 11:12:46
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST } from '../../const';
import multiCorpRefHandler from '../../../pub/tool/MultiCorpRefHandler';
import { addLine_BtnClick } from '../btnClicks';
import { createBodyAfterEventData, processBillCardBodyEditResult } from '../../../pub/tool/afterEditUtil';
import { processCardTableAutoAddRow } from '../../../pub/tool/autoAddRowUtil';

// 编辑事件不关注的字段
const NOTPRO_FIELDS = [ 'crowno', 'vrownote' ];

export default function bodyAfterEvent(props, moduleId, key, value, changedrows, i) {
	if (key === 'csaleorgid') {
		// 根据“销售组织”过滤：销售部门，销售业务员，销售客户
		multiCorpRefHandler.call(this, this.props, value, PREPAIDINVOICE_CONST.tableId, [
			'csaledeptid',
			'cemployeeid',
			'ccustid'
		]);
	}

	if (NOTPRO_FIELDS.includes(key)) {
		return;
	}
	if (
		(changedrows[0].newvalue.value === changedrows[0].oldvalue.value && changedrows.length == 1) ||
		(JSON.stringify(changedrows[0].newvalue.value) == '{}' &&
			(changedrows[0].oldvalue.value == null || JSON.stringify(changedrows[0].oldvalue.value) == '{}'))
	) {
		return;
	}
	let usermap = new Map(); // <行号，该行的调整额度>
	let req = createBodyAfterEventData(
		props,
		PREPAIDINVOICE_CONST.cardPageId,
		PREPAIDINVOICE_CONST.formId,
		PREPAIDINVOICE_CONST.tableId,
		moduleId,
		key,
		changedrows,
		i,
		usermap
	);

	ajax({
		url: PREPAIDINVOICE_CONST.bodyafter,
		data: req,
		async: false,
		success: (res) => {
			// 关闭更新平台组件setState开关
			this.props.beforeUpdatePage();
			let billcard = res.data.billCard;
			if (billcard.head) {
				this.props.form.setAllFormValue({
					[PREPAIDINVOICE_CONST.formId]: billcard.head[PREPAIDINVOICE_CONST.formId]
				});
			}
			if (billcard.body) {
				processBillCardBodyEditResult(this.props, moduleId, res.data, i);
			}
			// 开启更新界面数据
			this.props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
			processCardTableAutoAddRow(props, PREPAIDINVOICE_CONST.tableId, i, {
				isMuli: changedrows.length > 1 ? true : false,
				isAutoAddFunc: isAutoAdd.bind(this, this.props),
				autoAddFunc: addLine_BtnClick.bind(this, this.props, false)
			});
		}
	});
}
function isAutoAdd(props) {
	// let isSrc = true;
	// let tableData = props.cardTable.getVisibleRows(PREPAIDINVOICE_CONST.tableId);
	// tableData.forEach((rowdata) => {
	// 	if (rowdata.values[PrepaidinvoiceBodyItem.vsrctype].value) {
	// 		isSrc = false;
	// 	}
	// });
	return true;
}
