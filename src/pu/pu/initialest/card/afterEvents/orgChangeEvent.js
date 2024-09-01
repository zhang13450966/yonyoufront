/*
 * @Author: zhaochyu
 * @PageInfo: 主组织编辑后事件
 * @Date: 2018-04-15 14:41:59
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-26 09:33:26
 */

import { ajax, toast } from 'nc-lightapp-front';
import { AREA, UISTATE, FIELD, URL, PAGECODE, LIST_BUTTON, HEAD_FIELD, ATTRCODES, BODY_FIELD } from '../../constance';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
export default function afterEvent(props, moduleId, key, value, before) {
	let copy = this.props.getUrlParam(LIST_BUTTON.Copy);
	if (!before.value && value.value) {
		if (before.value == value.value) return;
		//获取表体行数量
		if (copy == null) {
			let rows = 0;
			if (props.cardTable.getNumberOfRows(AREA.cardTableArea)) {
				rows = props.cardTable.getNumberOfRows(AREA.cardTableArea);
				for (let ii = 0; ii < rows; ii++) {
					props.cardTable.delRowsByIndex(PAGECODE.cardbody, 0);
				}
			}
			props.cardTable.addRow(PAGECODE.cardbody);
			RownoUtils.setRowNo(props, FIELD.cardTable, ATTRCODES.crowno);
		}
		//获取表单编辑后数据
		let data = createHeadAfterEventData(
			props,
			PAGECODE.cardpagecode,
			PAGECODE.cardhead,
			PAGECODE.cardbody,
			moduleId,
			key,
			value
		);
		let pk_org_vValue = data.newvalue.value;
		let pk_org_vName = data.newvalue.display;
		data.card.head.card_head.rows[0].values.pk_org_v = { value: data.newvalue.value };
		ajax({
			url: URL.headAfterEdit,
			data: data,
			mode: 'normal',
			success: (res) => {
				if (!res.data.success) {
					toast({ color: 'danger', content: res.data.error.message });
				}
				if (res.data && res.data.data.billCard && res.data.data.billCard.head) {
					processBillCardHeadEditResult(props, PAGECODE.cardhead, PAGECODE.cardbody, res.data.data);
					props.form.setFormItemsValue(AREA.cardFormArea, {
						[HEAD_FIELD.fbillstatus]: {
							value: '0',
							display: getLangByResId(this, '4004INITIALEST-000000') /* 国际化处理： 自由*/
						}
					});
					let pk_org_v = res.data.data.billCard.head.card_head.rows[0].values.pk_org_v;
					if (pk_org_v == null) {
						props.form.setFormItemsValue(AREA.cardFormArea, {
							[HEAD_FIELD.pk_org_v]: {
								value: pk_org_vValue,
								display: pk_org_vName
							}
						});
					}
					props.resMetaAfterPkorgEdit(FIELD.pk_org_v);
					//单据状态不可编辑
					props.form.setFormItemsDisabled(PAGECODE.cardhead, {
						[HEAD_FIELD.fbillstatus]: true
					});
					//保管员、仓库、单位不可编辑
					props.form.setFormItemsDisabled(AREA.cardFormArea, {
						[HEAD_FIELD.pk_stordoc]: true,
						[HEAD_FIELD.pk_managepsn]: true,
						[BODY_FIELD.castunitid]: true
					});
					props.cardTable.setStatus(AREA.cardTableArea, UISTATE.edit);
					buttonController.lineSelected.call(this, this.props, false);
				}
				//主组织编辑后成功后给交易类型设定默认值
				transtypeUtils.setValue.call(this, PAGECODE.cardhead, HEAD_FIELD.ctrantypeid, HEAD_FIELD.vtrantypecode);
			}
		});
	} else if (before.value != value.value) {
		// 执行切换主组织事件
		showWarningDialog(
			getLangByResId(this, '4004INITIALEST-000039'),
			getLangByResId(this, '4004INITIALEST-000001'),
			{
				/* 国际化处理： 确认要修改组织？，这样会清空您录入的信息！*/
				beSureBtnClick: SwitchFunction.bind(this, {
					props: props,
					moduleId: moduleId,
					key: key,
					value: value,
					before: before,
					copy: copy
				}),
				cancelBtnClick: () => {
					props.form.setFormItemsValue(PAGECODE.cardhead, {
						[FIELD.pk_org_v]: {
							value: before.value,
							display: before.display
						}
					});
				}
			}
		);
	}
}
//切换主组织
function SwitchFunction(params) {
	let { props, moduleId, key, value, before, after, copy } = params;
	props.form.setFormStatus(AREA.cardFormArea, UISTATE.edit);
	props.cardTable.setStatus(AREA.cardTableArea, UISTATE.edit);
	props.form.EmptyAllFormValue(AREA.cardFormArea);
	props.cardTable.setTableData(AREA.cardTableArea, { rows: [] });
	let status = props.getUrlParam(FIELD.cardStatus);
	if (status == UISTATE.edit || status == UISTATE.add) {
		props.initMetaByPkorg('pk_org_v');
	}
	if (value !== null && value.value !== null && value.value !== '') {
		//获取表体行数量
		if (copy == null) {
			let rows = null;
			if (props.cardTable.getNumberOfRows(AREA.cardTableArea)) {
				rows = props.cardTable.getNumberOfRows(AREA.cardTableArea);
			}
			for (let ii = 0; ii < rows; ii++) {
				props.cardTable.delRowsByIndex(PAGECODE.cardbody, 0);
			}
			props.cardTable.addRow(PAGECODE.cardbody);
			RownoUtils.setRowNo(props, FIELD.cardTable, ATTRCODES.crowno);
		}
		//获取表单编辑后数据
		let data = createHeadAfterEventData(
			props,
			PAGECODE.cardpagecode,
			PAGECODE.cardhead,
			PAGECODE.cardbody,
			moduleId,
			key,
			value
		);
		data.card.head.card_head.rows[0].values.pk_org_v = { value: data.newvalue.value };
		let pk_org_vValue = data.newvalue.value;
		let pk_org_Display = data.newvalue.display;
		ajax({
			url: URL.headAfterEdit,
			data: data,
			mode: 'normal',
			success: (res) => {
				if (!res.data.success) {
					toast({ color: 'danger', content: res.data.error.message });
				}
				//表头赋值
				if (res.data && res.data.data.billCard && res.data.data.billCard.head) {
					processBillCardHeadEditResult(props, PAGECODE.cardhead, PAGECODE.cardbody, res.data.data);
					props.form.setFormItemsValue(AREA.cardFormArea, {
						[HEAD_FIELD.pk_org_v]: {
							value: pk_org_vValue,
							scale: '-1',
							display: pk_org_Display
						}
					});
					props.form.setFormItemsValue(AREA.cardFormArea, {
						[HEAD_FIELD.fbillstatus]: {
							value: '0',
							display: getLangByResId(this, '4004INITIALEST-000000') /* 国际化处理： 自由*/
						}
					});
					props.resMetaAfterPkorgEdit();
					props.cardTable.setStatus(AREA.cardTableArea, UISTATE.edit);
					//单据状态不可编辑
					props.form.setFormItemsDisabled(PAGECODE.cardhead, {
						[HEAD_FIELD.fbillstatus]: true
					});
					props.form.setFormItemsDisabled(AREA.cardFormArea, {
						[HEAD_FIELD.pk_stordoc]: true
					});
				}
				transtypeUtils.setValue.call(this, PAGECODE.cardhead, HEAD_FIELD.ctrantypeid, HEAD_FIELD.vtrantypecode);
			}
		});
	} else {
		buttonController.lineSelected.call(this, this.props, true);
	}
}
