/*
 * @Author: 刘奇 
 * @PageInfo: 代垫运费发票表头编辑后事件
 * @Date: 2019-03-08 11:20:17 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-01-05 16:55:02
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, PrepaidinvoiceBodyItem, CARD_BODY_BUTTONS } from '../../const';
import { deepClone } from '../../../../../scmpub/scmpub/pub/tool/index';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { addLine_BtnClick } from '../btnClicks';

export default function headAfterEvent(props, moduleId, key, value, rows, isAdd) {
	// 表头编辑事件差异更新
	let data = createHeadAfterEventData(
		props,
		PREPAIDINVOICE_CONST.cardPageId,
		PREPAIDINVOICE_CONST.formId,
		PREPAIDINVOICE_CONST.tableId,
		moduleId,
		key,
		value
	);
	//isAdd为true时，为新增时有默认主组织
	if (key === PrepaidinvoiceHeadItem.pk_org_v && isAdd == true) {
		afterEdit.call(this, data);
		return;
	}
	if (JSON.stringify(data.newvalue.value || {}) === JSON.stringify(data.oldvalue.value || {})) {
		return;
	}
	if (key === PrepaidinvoiceHeadItem.pk_org_v && JSON.stringify(data.oldvalue.value || {}) != '{}') {
		let oldvalue = data.oldvalue.value;
		if (oldvalue != null && data.newvalue.value != data.oldvalue.value) {
			let old = deepClone(data.oldvalue);
			showWarningDialog(
				getLangByResId(this, '4006PREPAIDINVOICE-000004'),
				getLangByResId(this, '4006PREPAIDINVOICE-000005'),
				{
					/* 国际化处理： 确认修改,是否修改组织，这样会清空您录入的信息？*/
					beSureBtnClick: afterEdit.bind(this, data),
					cancelBtnClick: cancelBtnClick.bind(this, old),
					closeModalEve: cancelBtnClick.bind(this, old)
				}
			);
			return;
		}
	} else if (key == PrepaidinvoiceHeadItem.dbilldate) {
		dbilldateAfterEdit.call(this, data);
		data = createHeadAfterEventData(
			props,
			PREPAIDINVOICE_CONST.cardPageId,
			PREPAIDINVOICE_CONST.formId,
			PREPAIDINVOICE_CONST.tableId,
			moduleId,
			key,
			value
		);
	}
	afterEdit.call(this, data);
}

function cancelBtnClick(oldvalue) {
	this.props.form.setFormItemsValue(PREPAIDINVOICE_CONST.formId, {
		pk_org_v: { value: oldvalue.value, display: oldvalue.display }
	});
}

function afterEdit(data) {
	if (data.attrcode == PrepaidinvoiceHeadItem.pk_org_v) {
		this.props.form.EmptyAllFormValue(PREPAIDINVOICE_CONST.formId);
		this.props.cardTable.setTableData(PREPAIDINVOICE_CONST.tableId, { rows: [] });
		if (data.newvalue.value) {
			this.props.resMetaAfterPkorgEdit();
			this.props.button.setButtonDisabled(CARD_BODY_BUTTONS.NOROW, false);
			this.props.form.setFormItemsValue(PREPAIDINVOICE_CONST.formId, {
				pk_org_v: data.newvalue
			});
			data = createHeadAfterEventData(
				this.props,
				PREPAIDINVOICE_CONST.cardPageId,
				PREPAIDINVOICE_CONST.formId,
				PREPAIDINVOICE_CONST.tableId,
				PREPAIDINVOICE_CONST.formId,
				PrepaidinvoiceHeadItem.pk_org_v,
				data.newvalue
			);
		} else {
			// 清空表头表体
			this.props.form.EmptyAllFormValue(PREPAIDINVOICE_CONST.formId);
			this.props.initMetaByPkorg(PrepaidinvoiceHeadItem.pk_org_v);
			this.props.button.setButtonDisabled(CARD_BODY_BUTTONS.ALL, true);
			return;
		}
	} else if (data.attrcode == PrepaidinvoiceHeadItem.dbilldate) {
		dbilldateAfterEdit.call(this, data);
	}
	ajax({
		url: PREPAIDINVOICE_CONST.headafter,
		data: data,
		async: false, // 改为同步请求
		success: (res) => {
			// 关闭更新平台组件setState开关
			this.props.beforeUpdatePage();
			// 表头编辑事件差异更新
			processBillCardHeadEditResult(
				this.props,
				PREPAIDINVOICE_CONST.formId,
				PREPAIDINVOICE_CONST.tableId,
				res.data
			);
			// 开启更新界面开关
			this.props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
			if (data.attrcode == PrepaidinvoiceHeadItem.pk_org_v) {
				addLine_BtnClick.call(this, this.props, false);
			}
		}
	});
}

function dbilldateAfterEdit(data) {
	let rowcount = this.props.cardTable.getNumberOfRows(PREPAIDINVOICE_CONST.tableId);
	for (let index = 0; index < rowcount; index++) {
		this.props.cardTable.setValByKeyAndIndex(
			PREPAIDINVOICE_CONST.tableId,
			index,
			PrepaidinvoiceBodyItem.dbilldate,
			{
				value: data.newvalue.value
			}
		);
	}
}
