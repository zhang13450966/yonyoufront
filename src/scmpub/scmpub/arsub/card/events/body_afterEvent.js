/*
 * @Author: 刘奇 
 * @PageInfo: 卡片表体编辑事件   
 * @Date: 2019-03-12 14:43:23 
 * @Last Modified by: sunxxf
 * @Last Modified time: 2021-03-23 12:34:48
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubBodyItem, ArsubQueryBodyItem } from '../../const';
import multiCorpRefHandler from '../../../pub/tool/MultiCorpRefHandler';
import { createBodyAfterEventData, processBillCardBodyEditResult } from '../../../pub/tool/afterEditUtil';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { processCardTableAutoAddRow } from '../../../pub/tool/autoAddRowUtil';
import { addLine_BtnClick } from '../btnClicks';
// 编辑事件不关注的字段
const NOTPRO_FIELDS = [ 'crowno', 'vrownote' ];

export default function bodyAfterEvent(props, moduleId, key, value, changedrows, i, record, type, method) {
	if (key === 'csaleorgid') {
		// 根据“销售组织”过滤：销售部门，销售业务员，销售客户
		multiCorpRefHandler.call(this, this.props, value, ARSUB_CONST.tableId, [
			'csaledeptid',
			'cemployeeid',
			'ccustid'
		]);
	} else if (key === ArsubBodyItem.cpayorgid) {
		if (value == null) {
			this.props.cardTable.setEditableByIndex(moduleId, i, ArsubBodyItem.cincomeprejectid, false);
		} else {
			this.props.cardTable.setEditableByIndex(moduleId, i, ArsubBodyItem.cincomeprejectid, true);
		}
	} else if (key === ArsubBodyItem.cprofitcenterid) {
		if (value == null) {
			this.props.cardTable.setEditableByIndex(moduleId, i, ArsubBodyItem.ccostcenterid, false);
		} else {
			this.props.cardTable.setEditableByIndex(moduleId, i, ArsubBodyItem.ccostcenterid, true);
		}
	} else if (key === ArsubBodyItem.nsustainrate) {
		if (value > 100 || value < 0) {
			this.props.cardTable.setValByKeyAndIndex(ARSUB_CONST.tableId, i, ArsubBodyItem.nsustainrate, {
				value: changedrows[0].oldvalue.value
			});
			showErrorInfo(getLangByResId(this, '4006ARSUB-000037')); /* 国际化处理： 客户费用支持比例只允许在0 % 到100 % 之间*/
			return;
		}
		if (!Number.isInteger(value) && parseInt(value) < parseFloat(value)) {
			this.props.cardTable.setValByKeyAndIndex(ARSUB_CONST.tableId, i, ArsubBodyItem.nsustainrate, {
				value: null
			});
			showErrorInfo(getLangByResId(this, '4006ARSUB-000043')); /* 国际化处理： 客户费用支持比例存在小数*/
			return;
		}
		this.props.cardTable.setValByKeyAndIndex(ARSUB_CONST.tableId, i, ArsubBodyItem.nsustainrate, {
			value: parseInt(value),
			scale: 0,
			diaplay: parseInt(value)
		});
	} else if (key === ArsubBodyItem.norigarsubmny) {
		let ndeclaremny = this.props.cardTable.getValByKeyAndIndex(ARSUB_CONST.tableId, i, ArsubBodyItem.ndeclaremny)
			.value;
		if (value && ndeclaremny && value / ndeclaremny > 1) {
			this.props.cardTable.setValByKeyAndIndex(ARSUB_CONST.tableId, i, ArsubBodyItem.norigarsubmny, {
				value: null
			});
			this.props.cardTable.setValByKeyAndIndex(ARSUB_CONST.tableId, i, ArsubBodyItem.nsustainrate, {
				value: null
			});
			this.props.cardTable.setValByKeyAndIndex(ARSUB_CONST.tableId, i, ArsubBodyItem.nremainmny, {
				value: null
			});
			showErrorInfo(getLangByResId(this, '4006ARSUB-000037')); /* 国际化处理： 客户费用支持比例只允许在0 % 到100 % 之间*/
			return;
		}
	}

	if (NOTPRO_FIELDS.includes(key)) {
		return;
	}
	let usermap = new Map(); // <行号，该行的调整额度>
	let req = createBodyAfterEventData(
		props,
		ARSUB_CONST.cardPageId,
		ARSUB_CONST.formId,
		ARSUB_CONST.tableId,
		moduleId,
		key,
		changedrows,
		i,
		usermap
	);
	if (
		changedrows[0].newvalue.value === changedrows[0].oldvalue.value ||
		(JSON.stringify(changedrows[0].newvalue.value) == '{}' &&
			(changedrows[0].oldvalue.value == null || JSON.stringify(changedrows[0].oldvalue.value) == '{}'))
	) {
		return;
	}

	ajax({
		url: ARSUB_CONST.bodyafter,
		data: req,
		async: false,
		success: (res) => {
			// 关闭更新平台组件setState开关
			this.props.beforeUpdatePage();

			let billcard = res.data.billCard;
			if (billcard.head) {
				this.props.form.setAllFormValue({
					[ARSUB_CONST.formId]: billcard.head[ARSUB_CONST.formId]
				});
			}
			if (billcard.body) {
				processBillCardBodyEditResult(this.props, ARSUB_CONST.tableId, res.data, i);
			}
			// 开启更新界面数据
			this.props.updatePage(ARSUB_CONST.formId, ARSUB_CONST.tableId);

			processCardTableAutoAddRow(props, ARSUB_CONST.tableId, i, {
				isMuli: changedrows.length > 1 ? true : false,
				isAutoAddFunc: isAutoAdd.bind(this, this.props),
				autoAddFunc: addLine_BtnClick.bind(this, this.props, false)
			});
		}
	});
}
function isAutoAdd(props) {
	let isSrc = true;
	let tableData = props.cardTable.getVisibleRows(ARSUB_CONST.tableId);
	tableData.forEach((rowdata) => {
		if (rowdata.values[ArsubQueryBodyItem.vsrctype].value) {
			isSrc = false;
		}
	});
	return isSrc;
}
export { isAutoAdd };
