/*
 * @Author: chaiwx 
 * @PageInfo: 编辑后事件-表头  
 * @Date: 2018-04-10 12:23:33 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-04-13 17:28:45
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, FIELDS, PAGECODE, REQUESTURL, BUTTONID, UISTATE } from '../../constance';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { initEvents } from '../init';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { RownoUtils } from 'src/scmpub/scmpub/pub/tool/cardTableTools';

export default function(props, moduleId, key, value, oldVal, refInfo) {
	// 触发编辑后的字段
	let editItems = [
		FIELDS.cdeptvid,
		FIELDS.cdeptid,
		FIELDS.corigcurrencyid,
		FIELDS.nexchangerate,
		FIELDS.cpsnid,
		FIELDS.dbilldate
	];

	if (key === FIELDS.pk_org_v) {
		// 主组织切换事件
		let pk_org_old = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_org);
		if (!value.value) {
			showWarningDialog(
				getLangByResId(this, '4004Taxinvoice-000004'),
				getLangByResId(this, '4004Taxinvoice-000004'),
				{
					/* 国际化处理： 确认修改,是否修改组织，这样会清空您录入的信息？*/
					beSureBtnClick: () => {
						setTimeout(() => {
							props.form.EmptyAllFormValue(AREA.cardFormId);
							props.cardTable.setTableData(AREA.cardTableId, { rows: [] });
						}, 0);
						props.initMetaByPkorg();
						let disabledItem = { pk_org_v: false };
						props.form.setFormItemsDisabled(AREA.cardFormId, disabledItem);
						// props.button.setDisabled({
						// 	[BUTTONID.AddFeeLine]: true,
						// 	[BUTTONID.AddMatLine]: true
						// });
					},
					cancelBtnClick: () => {
						props.form.setFormItemsValue(moduleId, {
							pk_org_v: { value: oldVal.value, display: oldVal.display },
							pk_org: { value: pk_org_old.value, display: pk_org_old.display }
						});
					}
				}
			);
		} else if (value.value) {
			let data = createHeadAfterEventData(
				props,
				PAGECODE.cardPagecode,
				AREA.cardFormId,
				AREA.cardTableId,
				moduleId,
				key,
				value
			);

			//  主组织切换，清空表体（表体无用）
			data.card.body.body.rows = [];

			if (oldVal && oldVal.value) {
				showWarningDialog(
					getLangByResId(this, '4004Taxinvoice-000004'),
					getLangByResId(this, '4004Taxinvoice-000004'),
					{
						/* 国际化处理： 确认修改,是否修改组织，这样会清空您录入的信息？*/
						beSureBtnClick: doAction.bind(this, props, data, key),
						cancelBtnClick: () => {
							props.form.setFormItemsValue(moduleId, {
								pk_org_v: { value: oldVal.value, display: oldVal.display },
								pk_org: { value: pk_org_old.value, display: pk_org_old.display }
							});
						}
					}
				);
			} else {
				doAction.call(this, props, data, key);
			}
		}
	} else if (editItems.includes(key)) {
		let data = createHeadAfterEventData(
			props,
			PAGECODE.cardPagecode,
			AREA.cardFormId,
			AREA.cardTableId,
			moduleId,
			key,
			value
		);
		doAction.call(this, props, data, key);
	}
}

function doAction(props, data, key) {
	// ajax({
	// 	url: REQUESTURL.headAfterEdit,
	// 	data: data,
	// 	async: false,
	// 	success: (res) => {
	// 		if (res.data) {
	// 			let data = res.data;
	// 			processBillCardHeadEditResult(props, AREA.cardFormId, AREA.cardTableId, data);

	// 			if (key == 'pk_org_v') {
	// 				// 组织切换后初始化事件
	// 				initEvents.call(this, props);
	// 				props.resMetaAfterPkorgEdit();
	// 				props.button.setDisabled({
	// 					[BUTTONID.AddFeeLine]: false,
	// 					[BUTTONID.AddMatLine]: false
	// 				});
	// 			}
	// 		}
	// 	}
	// });
	//2.默认增行
	addRow.call(this, AREA.cardTableId);
	props.resMetaAfterPkorgEdit();
}

/**
 * 增行逻辑
 * @param {*} bodyArea 
 */
function addRow(bodyArea) {
	//默认增行
	this.props.cardTable.setStatus(bodyArea, UISTATE.edit);
	this.props.cardTable.addRow(bodyArea, undefined, undefined, false);
	RownoUtils.setRowNo(this.props, bodyArea, FIELDS.crowno);
}
