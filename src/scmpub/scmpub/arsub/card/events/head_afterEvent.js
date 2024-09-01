/*
 * @Author: 刘奇 
 * @PageInfo: 客户费用单表头编辑后事件
 * @Date: 2019-03-08 11:20:17 
 * @Last Modified by: zhangllb
 * @Last Modified time: 2022-06-13 13:48:48
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem, ArsubBodyItem, CARD_BODY_BUTTONS } from '../../const';
import { deepClone, transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool/index';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { addLine_BtnClick } from '../btnClicks';

// 参照只根据销售组织过滤的字段
const csaleorgid_filter_Fields = [ ArsubHeadItem.cemployeeid, ArsubHeadItem.cdeptvid ];
export default function headAfterEvent(props, moduleId, key, value, rows) {
	// 表头编辑事件差异更新
	let data = createHeadAfterEventData(
		props,
		ARSUB_CONST.cardPageId,
		ARSUB_CONST.formId,
		ARSUB_CONST.tableId,
		moduleId,
		key,
		value
	);
	if (JSON.stringify(data.newvalue.value || {}) === JSON.stringify(data.oldvalue.value || {})) {
		return;
	}
	if (key === ArsubHeadItem.pk_org_v && JSON.stringify(data.oldvalue.value || {}) != '{}') {
		let oldvalue = data.oldvalue.value;
		if (oldvalue != null && data.newvalue.value != data.oldvalue.value) {
			let old = deepClone(data.oldvalue);
			showWarningDialog(getLangByResId(this, '4006ARSUB-000004'), getLangByResId(this, '4006ARSUB-000005'), {
				/* 国际化处理： 确认修改,是否修改组织，这样会清空您录入的信息？*/
				beSureBtnClick: afterEdit.bind(this, data),
				cancelBtnClick: cancelBtnClick.bind(this, old),
				closeModalEve: cancelBtnClick.bind(this, old)
			});
			return;
		}
	}
	if (key == ArsubHeadItem.corigcurrencyid) {
		this.props.form.setFormItemsValue(ARSUB_CONST.formId, {
			nexchangerate: { value: null, display: null }
		});
		let rowcount = this.props.cardTable.getNumberOfRows(ARSUB_CONST.tableId);
		for (let index = 0; index < rowcount; index++) {
			this.props.cardTable.setValByKeyAndIndex(ARSUB_CONST.tableId, index, ArsubBodyItem.nsustainmny, {
				value: null,
				display: null
			});
		}
	}
	afterEdit.call(this, data);
}

function cancelBtnClick(oldvalue) {
	this.props.form.setFormItemsValue(ARSUB_CONST.formId, {
		pk_org_v: { value: oldvalue.value, display: oldvalue.display }
	});
}

function afterEdit(data) {
	if (data.attrcode == ArsubHeadItem.pk_org_v) {
		this.props.form.EmptyAllFormValue(ARSUB_CONST.formId);
		this.props.cardTable.setTableData(ARSUB_CONST.tableId, { rows: [] });
		if (data.newvalue.value) {
			// 交易类型
			transtypeUtils.setValue.call(
				this,
				ARSUB_CONST.formId,
				ArsubHeadItem.ctrantypeid,
				ArsubHeadItem.vtrantypecode
			);
			this.props.resMetaAfterPkorgEdit();
			this.props.button.setButtonDisabled(CARD_BODY_BUTTONS.NOROW, false);
			this.props.form.setFormItemsValue(ARSUB_CONST.formId, {
				pk_org_v: data.newvalue
			});
			data = createHeadAfterEventData(
				this.props,
				ARSUB_CONST.cardPageId,
				ARSUB_CONST.formId,
				ARSUB_CONST.tableId,
				ARSUB_CONST.formId,
				ArsubHeadItem.pk_org_v,
				data.newvalue
			);
		} else {
			this.props.initMetaByPkorg(ArsubHeadItem.pk_org_v);
			this.props.button.setButtonDisabled(CARD_BODY_BUTTONS.ALL, true);
			return;
		}
	} else if (data.attrcode == ArsubHeadItem.dbilldate) {
		dbilldateAfterEdit.call(this, data);
		// return;
	} else if (data.attrcode == ArsubHeadItem.csaleorgvid) {
		let pk_org = (this.props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.csaleorgvid) || {}).value;
		let nmeta = this.props.meta.getMeta();
		let items = nmeta[ARSUB_CONST.formId].items;
		items.forEach((element) => {
			if (csaleorgid_filter_Fields.includes(element.attrcode) && pk_org) {
				element.isShowUnit = false;
			} else {
				element.isShowUnit = true;
			}
		});
		this.props.meta.setMeta(nmeta);
		let oldvalue = data.oldvalue.value;
		if (oldvalue != null && data.newvalue.value != data.oldvalue.value) {
			this.props.form.setFormItemsValue(ARSUB_CONST.formId, {
				[ArsubHeadItem.cemployeeid]: { value: null, display: null },
				[ArsubHeadItem.cdeptvid]: { value: null, display: null },
				[ArsubHeadItem.cdeptid]: { value: null, display: null }
			});
		}
	} else if (data.attrcode == ArsubHeadItem.cdeptvid) {
		cdeptvidAfterEdit.call(this, data);
		// return;
	}
	ajax({
		url: ARSUB_CONST.headafter,
		data: data,
		async: false, // 改为同步请求
		success: (res) => {
			// 关闭更新平台组件setState开关
			this.props.beforeUpdatePage();
			// 表头编辑事件差异更新
			processBillCardHeadEditResult(this.props, ARSUB_CONST.formId, ARSUB_CONST.tableId, res.data);
			if (data.attrcode == ArsubHeadItem.pk_org_v) {
				addLine_BtnClick.call(this, this.props, false);
			}
			// 开启更新界面开关
			this.props.updatePage(ARSUB_CONST.formId, ARSUB_CONST.tableId);
		}
	});
}

function dbilldateAfterEdit(data) {
	let rowcount = this.props.cardTable.getNumberOfRows(ARSUB_CONST.tableId);
	for (let index = 0; index < rowcount; index++) {
		this.props.cardTable.setValByKeyAndIndex(ARSUB_CONST.tableId, index, ArsubBodyItem.dbilldate, {
			value: data.newvalue.value
		});
	}
}
function cdeptvidAfterEdit(data) {
	if (data.newvalue.value) {
		let rowcount = this.props.cardTable.getNumberOfRows(ARSUB_CONST.tableId);
		let pk_org = (this.props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.csaleorgid) || {}).value;
		for (let index = 0; index < rowcount; index++) {
			let cpaydeptid = this.props.cardTable.getValByKeyAndIndex(
				ARSUB_CONST.tableId,
				index,
				ArsubBodyItem.cpaydeptid || {}
			).value;
			let cpayorgid = this.props.cardTable.getValByKeyAndIndex(
				ARSUB_CONST.tableId,
				index,
				ArsubBodyItem.cpayorgid || {}
			).value;
			if (pk_org == cpayorgid && cpaydeptid == null) {
				this.props.cardTable.setValByKeyAndIndex(ARSUB_CONST.tableId, index, ArsubBodyItem.cpaydeptid, {
					display: data.newvalue.display,
					value: data.newvalue.value
				});
			}
		}
	}
}
