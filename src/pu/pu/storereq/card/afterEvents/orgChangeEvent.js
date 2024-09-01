/*
 * @Author: zhangchangqing
 * @PageInfo: 主组织编辑后事件  
 * @Date: 2018-05-03 14:57:47 
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-08-12 19:18:14
 */
import { ajax, base, toast } from 'nc-lightapp-front';
import { STOREREQ_CARD, ATTRCODES, ATTRCODE } from '../../siconst';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { buttonController } from '../viewControl';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
let formId = STOREREQ_CARD.formId; //'head';
let tableId = STOREREQ_CARD.tableId; //'body';
const { NCMessage } = base;
export default function afterEvent(props, moduleId, key, value, changedrows, record) {
	let userobject = {};
	//清空主组织
	if (value.value == null || value == '' || value instanceof Array || Object.keys(value.value).length === 0) {
		showWarningDialog(getLangByResId(this, '4004STOREREQ-000050'), getLangByResId(this, '4004STOREREQ-000002'), {
			/* 国际化处理： 清空组织会清空您录入的信息！*/
			beSureBtnClick: () => {
				//自己的逻辑
				// 1、组织为空时清空表单数据且表体不可编辑
				props.form.EmptyAllFormValue(STOREREQ_CARD.formId);
				props.form.setFormItemsValue(STOREREQ_CARD.formId, {
					[ATTRCODE.pk_org_v]: { value: null, display: null }
				});
				let data = createHeadAfterEventData(
					props,
					STOREREQ_CARD.cardpageid,
					STOREREQ_CARD.formId,
					STOREREQ_CARD.tableId,
					moduleId,
					key,
					value,
					userobject
				);

				ajax({
					url: STOREREQ_CARD.orgChangEventURL,
					data: data,
					mode: 'normal',
					success: (res) => {
						if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
							props.dealFormulamsg(
								res.formulamsg, //参数一：返回的公式对象
								{
									//参数二：界面使用的表格类型
									card_body: 'cardTable'
								}
							);
						}
						if (res.data && res.data.data && res.data.data.head && res.data.data.head[formId]) {
							this.props.form.setAllFormValue({ [formId]: res.data.data.head[formId] });
						}
					}
				});
				props.cardTable.setTableData(tableId, { rows: [] }); //清空表体
				props.cardTable.filterEmptyRows(tableId, [ ATTRCODES.pk_material ], 'include');
				props.initMetaByPkorg(STOREREQ_CARD.pk_org_v);
				buttonController.lineSelected.call(this);
			},
			cancelBtnClick: () => {
				props.form.setFormItemsValue(STOREREQ_CARD.formId, {
					[STOREREQ_CARD.pk_org_v]: { value: changedrows.value, display: changedrows.display }
				});
			}
		});
	} else {
		//修改主组织
		if (changedrows && value.value != changedrows.value && changedrows.value) {
			showWarningDialog(
				getLangByResId(this, '4004STOREREQ-000050'),
				getLangByResId(this, '4004STOREREQ-000002'),
				{
					/* 国际化处理： 修改组织会清空您录入的信息!*/
					beSureBtnClick: () => {
						props.form.EmptyAllFormValue(STOREREQ_CARD.formId);
						props.form.setFormItemsValue(STOREREQ_CARD.formId, {
							[STOREREQ_CARD.pk_org_v]: { value: value.value, display: value.display }
						});
						// //获取表体行数量
						// let rows = props.cardTable.getNumberOfRows(STOREREQ_CARD.tableId);
						// //删除表体行数
						// for (let ii = 0; ii < rows; ii++) {
						// 	props.cardTable.delRowsByIndex(STOREREQ_CARD.tableId, 0);
						// }
						props.cardTable.setTableData(STOREREQ_CARD.tableId, { rows: [] }); //清空表体
						props.cardTable.addRow(STOREREQ_CARD.tableId);
						RownoUtils.setRowNo(props, STOREREQ_CARD.tableId, ATTRCODES.crowno);
						let data = createHeadAfterEventData(
							props,
							STOREREQ_CARD.cardpageid,
							STOREREQ_CARD.formId,
							STOREREQ_CARD.tableId,
							moduleId,
							key,
							value,
							userobject
						);

						//调用编辑后事件
						ajax({
							url: STOREREQ_CARD.orgChangEventURL,
							data: data,
							mode: 'normal',
							success: (res) => {
								if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
									props.dealFormulamsg(
										res.formulamsg, //参数一：返回的公式对象
										{
											//参数二：界面使用的表格类型
											card_body: 'cardTable'
										}
									);
								}
								processBillCardHeadEditResult(
									props,
									STOREREQ_CARD.formId,
									STOREREQ_CARD.tableId,
									res.data.data
								);
								props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
								transtypeUtils.setValue.call(
									this,
									moduleId,
									ATTRCODE.ctrantypeid,
									ATTRCODE.vtrantypecode
								);
								buttonController.lineSelected.call(this);
								props.form.focusFormNextItem(
									ATTRCODE.pk_org_v,
									STOREREQ_CARD.formId,
									STOREREQ_CARD.formId
								);
							}
						});
					},
					cancelBtnClick: () => {
						props.form.setFormItemsValue(STOREREQ_CARD.formId, {
							[STOREREQ_CARD.pk_org_v]: { value: changedrows.value, display: changedrows.display }
						});
					}
				}
			);
		} else {
			//选择主组织
			if (value !== null && value.value !== null && value.value !== '') {
				// //获取表体行数量
				// let rows = props.cardTable.getNumberOfRows(STOREREQ_CARD.tableId);
				// //删除表体行数
				// for (let ii = 0; ii < rows; ii++) {
				// 	props.cardTable.delRowsByIndex(STOREREQ_CARD.tableId, 0);
				// }
				props.cardTable.setTableData(STOREREQ_CARD.tableId, { rows: [] }); //清空表体
				props.cardTable.addRow(STOREREQ_CARD.tableId);
				RownoUtils.setRowNo(props, STOREREQ_CARD.tableId, ATTRCODES.crowno);
				props.form.setFormItemsValue(STOREREQ_CARD.formId, {
					[STOREREQ_CARD.pk_org_v]: { value: record.refpk, display: record.refname }
				});
				let data = createHeadAfterEventData(
					props,
					STOREREQ_CARD.cardpageid,
					STOREREQ_CARD.formId,
					STOREREQ_CARD.tableId,
					moduleId,
					key,
					value,
					userobject
				);
				ajax({
					url: STOREREQ_CARD.orgChangEventURL,
					data: data,
					mode: 'normal',
					success: (res) => {
						if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
							props.dealFormulamsg(
								res.formulamsg, //参数一：返回的公式对象
								{
									//参数二：界面使用的表格类型
									card_body: 'cardTable'
								}
							);
						}
						processBillCardHeadEditResult(
							props,
							STOREREQ_CARD.formId,
							STOREREQ_CARD.tableId,
							res.data.data
						);
						props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
						transtypeUtils.setValue.call(this, moduleId, ATTRCODE.ctrantypeid, ATTRCODE.vtrantypecode);
						buttonController.lineSelected.call(this);
						props.form.focusFormNextItem(ATTRCODE.pk_org_v, STOREREQ_CARD.formId, STOREREQ_CARD.formId);
					}
				});
			}
		}
	}
}
