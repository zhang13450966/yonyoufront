/*
 * @Author: gaoxiaoqiang 
 * @PageInfo: 表头编辑后事件 
 * @Date: 2019-04-18 10:25:15 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 15:43:32
 */
import { ajax } from 'nc-lightapp-front';
import { TARGETBILL_CONST, FIELD } from '../../const';
import targetBillTableHeadUtil from '../../utils/targetBillTableHeadUtil';
import { deepClone } from '../../../../../scmpub/scmpub/pub/tool/index';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import buttonController from '../viewController/buttonController';

export default function headAfterEvent(props, moduleId, key, value, rows) {
	// 表头编辑事件差异更新
	let data = createHeadAfterEventData(
		props,
		TARGETBILL_CONST.cardPageId,
		TARGETBILL_CONST.formId,
		TARGETBILL_CONST.tableId,
		moduleId,
		key,
		value
	);
	let cardData = props.createMasterChildDataSimple(
		TARGETBILL_CONST.cardPageId,
		TARGETBILL_CONST.formId,
		TARGETBILL_CONST.tableId
	);
	if (JSON.stringify(data.newvalue.value || {}) === JSON.stringify(data.oldvalue.value || {})) {
		return;
	}
	if (key === FIELD.pk_org && JSON.stringify(data.oldvalue.value || {}) != '{}') {
		let oldvalue = data.oldvalue.value;
		if (oldvalue != null && data.newvalue.value != data.oldvalue.value) {
			showWarningDialog(
				getLangByResId(this, '4001TARGETBILL-000010') /* 国际化处理： 确认修改*/,
				getLangByResId(this, '4001TARGETBILL-000005') /* 国际化处理： 是否修改组织，这样会清空您录入的信息？*/,
				{
					beSureBtnClick: () => {
						pkOrgAfterEdit.call(this, data);
					},
					cancelBtnClick: () => {
						props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
							[key]: { value: rows.value, display: rows.display }
						});
					}
				}
			);
		}
	} else if (key == FIELD.ctargetid) {
		if (data.newvalue.value != undefined && data.newvalue.value != data.oldvalue.value) {
			this.ctargetvalue = value;
			this.props.cardTable.setTableData(TARGETBILL_CONST.tableId, { rows: [] });
			let data1 = {
				card: cardData
			};
			afterEdit.call(this, this.props, data1);
		} else {
			let meta = deepClone(this.meta);
			this.props.meta.setMeta(meta);
			this.props.cardTable.setTableData(TARGETBILL_CONST.tableId, { rows: [] });
			buttonController.call(this);
		}
	} else if (key == FIELD.cmardimenid || key == FIELD.vperiod) {
		let status = props.getUrlParam(TARGETBILL_CONST.status);
		//浏览态，物料和期间只查询，不做其他操作
		if (status && status == 'browse') {
			this.props.cardTable.setTableData(TARGETBILL_CONST.tableId, { rows: [] });
			if (data.newvalue.value != undefined && data.newvalue.value != data.oldvalue.value) {
				let data1 = {
					card: cardData,
					pks: [ data.newvalue.value ]
				};
				afterEdit.call(this, this.props, data1, value.value, key);
			} else {
				buttonController.call(this);
			}
		} else {
			let context;
			if (key == FIELD.vperiod) {
				context = getLangByResId(this, '4001TARGETADJ-000070'); /* 国际化处理： 您确定要修改期间吗？修改会保存界面数据请确认?*/
			} else if (key == FIELD.cmardimenid) {
				context = getLangByResId(this, '4001TARGETADJ-000071'); /* 国际化处理： 您确定要修改物料维度吗？修改会保存界面数据请确认?*/
			}
			if (value.value == null || value == '' || value instanceof Array || Object.keys(value.value).length === 0) {
				showWarningDialog(getLangByResId(this, '4001TARGETBILL-000010'), context, {
					/* 国际化处理： 确认修改*/
					beSureBtnClick: () => {
						// 1、为空时清空表单数据且表体不可编辑
						props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
							[key]: { value: null, display: null }
						});
						props.cardTable.setTableData(TARGETBILL_CONST.tableId, { rows: [] }); //清空表体
						props.cardTable.filterEmptyRows(TARGETBILL_CONST.tableId, [ FIELD.ccustomerid ], 'include'); //过滤空行
					},
					cancelBtnClick: () => {
						props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
							[key]: { value: rows.value, display: rows.display }
						});
					}
				});
			} else {
				//修改
				if (rows && value.value != rows.value && rows.value != null) {
					showWarningDialog(getLangByResId(this, '4001TARGETBILL-000010'), context, {
						/* 国际化处理： 是否修改指标表，这样会清空您录入的信息?*/
						beSureBtnClick: () => {
							props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
								[key]: { value: value.value, display: value.display }
							});
							//获取表体行数量
							let rows = props.cardTable.getNumberOfRows(TARGETBILL_CONST.tableId);
							//删除表体行数
							for (let ii = 0; ii < rows; ii++) {
								props.cardTable.delRowsByIndex(TARGETBILL_CONST.tableId, 0);
							}
							let data1 = {
								card: cardData,
								pks: [ data.newvalue.value ]
							};
							afterEdit.call(this, this.props, data1);
						},
						cancelBtnClick: () => {
							props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
								[key]: { value: rows.value, display: rows.display }
							});
						}
					});
				} else {
					if (value !== null && value.value !== null && value.value !== '') {
						//获取表体行数量
						let rows = props.cardTable.getNumberOfRows(TARGETBILL_CONST.tableId);
						//删除表体行数
						for (let ii = 0; ii < rows; ii++) {
							props.cardTable.delRowsByIndex(TARGETBILL_CONST.tableId, 0);
						}
						props.cardTable.addRow(TARGETBILL_CONST.tableId);
						props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
							[key]: { value: value.value, display: value.display }
						});
						ajax({
							url: TARGETBILL_CONST.headafter,
							data: data,
							//mode: 'normal',
							async: false,
							success: (res) => {
								processBillCardHeadEditResult(
									props,
									TARGETBILL_CONST.formId,
									TARGETBILL_CONST.tableId,
									res.data
								);
							}
						});
					}
				}
			}
		}
	} else {
		buttonController.call(this);
	}
}

function afterEdit(props, cardData, changevalue, key) {
	ajax({
		url: TARGETBILL_CONST.headafterquery,
		data: cardData,
		async: false, // 改为同步请求
		success: (res) => {
			if (res.data && res.data.retcard) {
				//获取页面数据
				let multiData = {
					bodyDownCloumsYear: res.data.retmap.bodyDownCloumsYear,
					bodyDownCloumsOther: res.data.retmap.bodyDownCloumsOther,
					bodyUpCloumsOther: res.data.retmap.bodyUpCloumsOther,
					bodyUpCloumsYear: res.data.retmap.bodyUpCloumsYear,
					formId: TARGETBILL_CONST.formId,
					tableId: TARGETBILL_CONST.tableId,
					headCloum: res.data.retmap.headCloum
					// multiData: res.data.multiData
				};
				targetBillTableHeadUtil.call(this, this.props, multiData);

				let vperiodValue = {};
				let cmardimenidValue = {};
				let pk_targetbill = {};
				if (res.data.retcard) {
					res.data.retcard.head[TARGETBILL_CONST.formId].rows.forEach((row) => {
						if (row.values.pk_targetbill.value) {
							pk_targetbill = row.values.pk_targetbill;
						}
						vperiodValue = row.values.vperiod;
						cmardimenidValue = row.values.cmardimenid;
					});
				}
				//增加这个地方判断是因为，当操作的是物料 或者期间，在清除该字段后，走的编辑后会重新给该字段赋值
				if (key == FIELD.cmardimenid || key == FIELD.vperiod) {
					if (vperiodValue) {
						if (!changevalue) {
							this.props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
								vperiod: { value: null, display: null },
								pk_targetbill: { value: pk_targetbill.value }
							});
						} else {
							this.props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
								vperiod: { value: vperiodValue.value, display: vperiodValue.display },
								pk_targetbill: { value: pk_targetbill.value }
							});
						}
					} else if (cmardimenidValue) {
						if (!changevalue) {
							this.props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
								cmardimenid: { value: null, display: null },
								pk_targetbill: { value: pk_targetbill.value }
							});
						} else {
							this.props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
								cmardimenid: { value: cmardimenidValue.value, display: cmardimenidValue.display },
								pk_targetbill: { value: pk_targetbill.value }
							});
						}
					}
				} else {
					if (vperiodValue) {
						this.props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
							vperiod: { value: vperiodValue.value, display: vperiodValue.display },
							pk_targetbill: { value: pk_targetbill.value }
						});
					} else if (cmardimenidValue) {
						this.props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
							cmardimenid: { value: cmardimenidValue.value, display: cmardimenidValue.display },
							pk_targetbill: { value: pk_targetbill.value }
						});
					}
				}

				if (res.data.retcard.body && res.data.retcard.body[TARGETBILL_CONST.tableId]) {
					this.props.cardTable.setTableData(
						TARGETBILL_CONST.tableId,
						res.data.retcard.body[TARGETBILL_CONST.tableId],
						null,
						true,
						true
					);
				}
			}
			buttonController.call(this);
		},
		error: () => {
			let meta = deepClone(this.meta);
			this.props.meta.setMeta(meta);
			this.props.cardTable.setTableData(TARGETBILL_CONST.tableId, { rows: [] });
			buttonController.call(this);
		}
	});
}
function pkOrgAfterEdit(data, CardData) {
	this.props.form.EmptyAllFormValue(TARGETBILL_CONST.formId);
	this.props.cardTable.setTableData(TARGETBILL_CONST.tableId, { rows: [] });
	if (data.newvalue.value) {
		this.props.resMetaAfterPkorgEdit();

		this.props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
			pk_org: data.newvalue
		});
	}

	let meta = deepClone(this.meta);

	meta[TARGETBILL_CONST.formId].items.forEach((item) => {
		if (item.attrcode != -1 && item.attrcode != FIELD.ctargetid && item.attrcode != FIELD.pk_org) {
			item.visible = false;
		}
	});
	meta[TARGETBILL_CONST.tableId].items.forEach((item) => {
		if (item.attrcode != -1 && item.attrcode != 'ccustomerid') {
			item.visible = false;
		}
	});
	this.props.meta.setMeta(meta);
	buttonController.call(this);
}
