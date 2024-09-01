/*
 * @Author: zhangchangqing 
 * @PageInfo: 表头编辑后事件  
 * @Date: 2018-05-03 14:54:12 
 * @Last Modified by: wanguoyu
 * @Last Modified time: yyyy-08-Tu 08:58:04
 */
import { ajax } from 'nc-lightapp-front';
import { TARGETADJ_CARD, ATTRCODE, ATTRCODES } from '../../siconst';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { deepClone } from '../../../../../scmpub/scmpub/pub/tool/index';
import { createHeadAfterEventData } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import targetBillTableHeadUtil from '../../utils/targetBillTableHeadUtil';
import buttonController from '../viewControl/buttonController';

let formId = TARGETADJ_CARD.formId;
let tableId = TARGETADJ_CARD.tableId;
export default function afterEvent(props, moduleId, key, value, changedrows, record) {
	let userobject = {};
	let data = createHeadAfterEventData(
		props,
		TARGETADJ_CARD.cardpageid,
		formId,
		tableId,
		moduleId,
		key,
		value,
		userobject,
		TARGETADJ_CARD.bodyFileds
	);
	let cardData = props.createMasterChildDataSimple(
		TARGETADJ_CARD.cardpageid,
		TARGETADJ_CARD.headf,
		TARGETADJ_CARD.tableId
	);
	if (key == ATTRCODE.ctargetid) {
		if (value.value == null || value == '' || value instanceof Array || Object.keys(value.value).length === 0) {
			showWarningDialog(
				getLangByResId(this, '4001TARGETADJ-000060') /* 国际化处理： 确认修改*/,
				getLangByResId(this, '4001TARGETADJ-000069') /* 国际化处理：是否修改指标表，这样会清空您录入的信息 */,
				{
					// 		/* 国际化处理： 清空组织会清空您录入的信息！*/
					beSureBtnClick: () => {
						// 1、组织为空时清空表单数据且表体不可编辑
						props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
							[key]: { value: null, display: null }
						});
						let meta = deepClone(this.meta);
						this.props.meta.setMeta(meta);
						props.cardTable.setTableData(TARGETADJ_CARD.tableId, { rows: [] }); //清空表体
						props.cardTable.filterEmptyRows(tableId, [ ATTRCODES.ccustomerid ], 'include'); //过滤空行
					},
					cancelBtnClick: () => {
						props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
							[key]: { value: changedrows.value, display: changedrows.display }
						});
					}
				}
			);
		} else {
			//修改
			this.fcyclesetflag = value.values.fcyclesetflag.value;
			if (
				changedrows.value == null ||
				changedrows == '' ||
				changedrows instanceof Array ||
				Object.keys(changedrows.value).length === 0
			) {
				ctargetidAfter.call(this, this.props, data, value, cardData);
			} else {
				showWarningDialog(
					getLangByResId(this, '4001TARGETADJ-000060') /* 国际化处理： 确认修改*/,
					getLangByResId(this, '4001TARGETADJ-000069') /* 国际化处理：是否修改指标表，这样会清空您录入的信息 */,
					{
						/* 国际化处理： 是否修改指标表，这样会清空您录入的信息?*/
						beSureBtnClick: () => {
							props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
								[key]: { value: value.value, display: value.display }
							});
							ctargetidAfter.call(this, this.props, data, value, cardData);
						},
						cancelBtnClick: () => {
							props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
								[key]: { value: changedrows.value, display: changedrows.display }
							});
						}
					}
				);
			}
		}
	} else if (key == ATTRCODE.cmarsetid || key == ATTRCODE.vperiod) {
		let status = props.getUrlParam(TARGETADJ_CARD.status);
		if (status && status == 'browse') {
			props.cardTable.setTableData(TARGETADJ_CARD.tableId, { rows: [] });
			if (value.value != undefined && value.value != changedrows.value) {
				let data1 = {
					card: cardData,
					pks: [ value.value ]
				};
				afterEdit.call(this, this.props, data1, value.value, key);
			} else {
				buttonController.call(this);
			}
		} else {
			let context;
			if (key == ATTRCODE.vperiod) {
				context = getLangByResId(this, '4001TARGETADJ-000070'); /* 国际化处理：您确定要修改期间吗？修改会保存界面数据请确认? */
			} else if (key == ATTRCODE.cmarsetid) {
				context = getLangByResId(this, '4001TARGETADJ-000071'); /* 国际化处理：您确定要修改物料维度吗？修改会保存界面数据请确认? */
			}
			if (value.value == null || value == '' || value instanceof Array || Object.keys(value.value).length === 0) {
				props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
					[key]: { value: changedrows.value, display: changedrows.display }
				});
			} else {
				//修改
				if (changedrows && value.value != changedrows.value && changedrows.value != null) {
					showWarningDialog(getLangByResId(this, '4001TARGETADJ-000060'), context, {
						/* 国际化处理： 是否修改指标表，这样会清空您录入的信息?*/
						beSureBtnClick: () => {
							props.cardTable.setTableData(TARGETADJ_CARD.tableId, { rows: [] }); //清空表体
							let data1 = {
								card: cardData,
								pks: [ value.value ]
							};
							afterEdit.call(this, this.props, data1);
						},
						cancelBtnClick: () => {
							props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
								[key]: { value: changedrows.value, display: changedrows.display }
							});
							props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
								[key]: { value: changedrows.value, display: changedrows.display }
							});
						}
					});
				} else {
					if (value !== null && value.value !== null && value.value !== '') {
						props.cardTable.setTableData(TARGETADJ_CARD.tableId, { rows: [] });
						props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
							[key]: { value: value.value, display: value.display }
						});
						props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
							[key]: { value: value.value, display: value.display }
						});
						let data1 = {
							card: cardData,
							pks: [ value.value ]
						};
						afterEdit.call(this, this.props, data1);
					}
				}
			}
		}
	}
}
//销售指标表审批流状态校验
function ctargetidAfter(props, data, value, cardData) {
	let meta = deepClone(this.meta);
	this.props.meta.setMeta(meta);
	props.cardTable.setTableData(TARGETADJ_CARD.tableId, { rows: [] }); //清空表体
	props.cardTable.filterEmptyRows(tableId, [ ATTRCODES.ccustomerid ], 'include'); //过滤空行
	this.ctargetvalue = value;
	ajax({
		url: TARGETADJ_CARD.headAfterEditURL,
		data: data,
		success: (res) => {
			//更新单据审批流状态
			if (
				res.data &&
				res.data.billCard.head[TARGETADJ_CARD.formId] &&
				res.data.billCard.head[TARGETADJ_CARD.formId].rows[0].values.fpfstatusflag &&
				res.data.billCard.head[TARGETADJ_CARD.formId].rows[0].values.fpfstatusflag.value
			) {
				this.props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
					fpfstatusflag: {
						value: res.data.billCard.head[TARGETADJ_CARD.formId].rows[0].values.fpfstatusflag.value
					}
				});
				this.setState({
					targetvalue: res.data.userObject.targetvalue
				});
			}
			let data1 = {
				card: cardData
			};
			afterEdit.call(this, this.props, data1);
		}
	});
}
//销售指标表编辑后事件
function afterEdit(props, cardData, changevalue, key) {
	ajax({
		url: TARGETADJ_CARD.headafterquery,
		data: cardData,
		async: false, // 改为同步请求
		success: (res) => {
			let multiData = {};
			if (res.data && res.data.retmap) {
				//获取页面数据
				multiData = {
					bodyDownCloumsYear: res.data.retmap.bodyDownCloumsYear,
					bodyDownCloumsOther: res.data.retmap.bodyDownCloumsOther,
					bodyUpCloumsOther: res.data.retmap.bodyUpCloumsOther,
					bodyUpCloumsYear: res.data.retmap.bodyUpCloumsYear,
					headf: TARGETADJ_CARD.headf,
					tableId: TARGETADJ_CARD.tableId,
					headCloum: res.data.retmap.headCloum
				};
				targetBillTableHeadUtil.call(this, this.props, multiData);
			}
			let vperiodValue = {};
			let cmardimenidValue = {};
			if (res.data.retcard) {
				res.data.retcard.head[TARGETADJ_CARD.formId].rows.forEach((row) => {
					vperiodValue = row.values.vperiod;
					cmardimenidValue = row.values.cmarsetid;
				});
			}
			//增加这个地方判断是因为，当操作的是物料 或者期间，在清除该字段后，走的编辑后会重新给该字段赋值
			if (key == ATTRCODE.cmarsetid || key == ATTRCODE.vperiod) {
				if (vperiodValue) {
					if (!changevalue) {
						this.props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
							vperiod: { value: null, display: null }
						});
					} else {
						this.props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
							vperiod: { value: vperiodValue.value, display: vperiodValue.display }
						});
					}
				} else if (cmardimenidValue) {
					if (!changevalue) {
						this.props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
							cmarsetid: { value: null, display: null }
						});
					} else {
						let meta2 = this.props.meta.getMeta();
						this.props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
							cmarsetid: { value: cmardimenidValue.value, display: cmardimenidValue.display }
						});
					}
				}
			} else {
				if (vperiodValue) {
					this.props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
						vperiod: { value: vperiodValue.value, display: vperiodValue.display }
					});
				} else if (cmardimenidValue) {
					let meta = this.props.meta.getMeta();
					this.props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
						cmarsetid: { value: cmardimenidValue.value, display: cmardimenidValue.display }
					});
				}
			}
			if (res.data.retcard && res.data.retcard.body && res.data.retcard.body[TARGETADJ_CARD.tableId]) {
				this.props.cardTable.setTableData(
					TARGETADJ_CARD.tableId,
					res.data.retcard.body[TARGETADJ_CARD.tableId],
					null,
					true,
					true
				);
			}
			this.oldtabledata = props.cardTable.getAllRows(TARGETADJ_CARD.tableId);
			buttonController.setUIState.call(this);
		}
	});
}
