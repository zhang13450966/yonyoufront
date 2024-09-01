/*
 * @Author: zhangchangqing
 * @PageInfo: 主组织编辑后事件  
 * @Date: 2018-05-03 14:57:47 
 * @Last Modified by: songyt13
 * @Last Modified time: 2021-10-18 13:34:19
 */
import { ajax } from 'nc-lightapp-front';
import { TARGETADJ_CARD, ATTRCODES, ATTRCODE } from '../../siconst';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { buttonController } from '../viewControl';
let formId = TARGETADJ_CARD.formId; //'head';
let tableId = TARGETADJ_CARD.tableId; //'body';
export default function afterEvent(props, moduleId, key, value, changedrows, record) {
	let userobject = {};
	//清空主组织
	if (value.value == null || value == '' || value instanceof Array || Object.keys(value.value).length === 0) {
		showWarningDialog(getLangByResId(this, '4001TARGETADJ-000060'), getLangByResId(this, '4001TARGETADJ-000002'), {
			/* 国际化处理： 清空组织会清空您录入的信息！*/
			beSureBtnClick: () => {
				// 1、组织为空时清空表单数据且表体不可编辑
				props.form.EmptyAllFormValue(TARGETADJ_CARD.formId);
				props.form.EmptyAllFormValue(TARGETADJ_CARD.headf);
				props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
					[ATTRCODE.pk_org]: { value: null, display: null }
				});
				props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
					[ATTRCODE.pk_org]: { value: null, display: null }
				});
				props.cardTable.setTableData(TARGETADJ_CARD.tableId, { rows: [] }); //清空表体
				props.cardTable.filterEmptyRows(tableId, [ ATTRCODES.ccustomerid ], 'include'); //过滤空行
				let data = createHeadAfterEventData(
					props,
					TARGETADJ_CARD.cardpageid,
					TARGETADJ_CARD.formId,
					TARGETADJ_CARD.tableId,
					moduleId,
					key,
					value,
					userobject
				);

				ajax({
					url: TARGETADJ_CARD.orgChangEventURL,
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
							this.props.form.setAllFormValue({ [TARGETADJ_CARD.headf]: res.data.data.head[formId] });
						}
					}
				});
				props.initMetaByPkorg(TARGETADJ_CARD.pk_org);
				buttonController.lineSelected.call(this);
			},
			cancelBtnClick: () => {
				props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
					[TARGETADJ_CARD.pk_org]: { value: changedrows.value, display: changedrows.display }
				});
				props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
					[TARGETADJ_CARD.pk_org]: { value: changedrows.value, display: changedrows.display }
				});
			}
		});
	} else {
		//修改主组织
		if (changedrows && value.value != changedrows.value && changedrows.value != null && changedrows.value != '') {
			showWarningDialog(
				getLangByResId(this, '4001TARGETADJ-000060'),
				getLangByResId(this, '4001TARGETADJ-000002'),
				{
					/* 国际化处理： 修改组织会清空您录入的信息!*/
					beSureBtnClick: () => {
						props.form.EmptyAllFormValue(TARGETADJ_CARD.formId);
						props.form.EmptyAllFormValue(TARGETADJ_CARD.headf);
						props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
							[TARGETADJ_CARD.pk_org]: { value: value.value, display: value.display }
						});
						props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
							[TARGETADJ_CARD.pk_org]: { value: value.value, display: value.display }
						});
						//获取表体行数量
						let rows = props.cardTable.getNumberOfRows(TARGETADJ_CARD.tableId);
						//删除表体行数
						for (let ii = 0; ii < rows; ii++) {
							props.cardTable.delRowsByIndex(TARGETADJ_CARD.tableId, 0);
						}
						props.cardTable.addRow(TARGETADJ_CARD.tableId);
						let data = createHeadAfterEventData(
							props,
							TARGETADJ_CARD.cardpageid,
							TARGETADJ_CARD.formId,
							TARGETADJ_CARD.tableId,
							moduleId,
							key,
							value,
							userobject
						);
						//调用编辑后事件
						ajax({
							url: TARGETADJ_CARD.orgChangEventURL,
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
									TARGETADJ_CARD.formId,
									TARGETADJ_CARD.tableId,
									res.data.data
								);
								props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
								buttonController.lineSelected.call(this);
								// props.form.focusFormNextItem(
								// 	ATTRCODE.pk_org,
								// 	TARGETADJ_CARD.formId,
								// 	TARGETADJ_CARD.formId
								// );暂时注释掉，在主组织改变后会自动调用日期组件
							}
						});
					},
					cancelBtnClick: () => {
						props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
							[TARGETADJ_CARD.pk_org]: { value: changedrows.value, display: changedrows.display }
						});
						props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
							[TARGETADJ_CARD.pk_org]: { value: changedrows.value, display: changedrows.display }
						});
					}
				}
			);
		} else {
			//选择主组织
			if (value && value.value) {
				//获取表体行数量
				let rows = props.cardTable.getNumberOfRows(TARGETADJ_CARD.tableId);
				//删除表体行数
				for (let ii = 0; ii < rows; ii++) {
					props.cardTable.delRowsByIndex(TARGETADJ_CARD.tableId, 0);
				}
				props.cardTable.addRow(TARGETADJ_CARD.tableId);
				props.form.setFormItemsValue(TARGETADJ_CARD.formId, {
					[TARGETADJ_CARD.pk_org]: { value: record.refpk, display: record.refname }
				});
				props.form.setFormItemsValue(TARGETADJ_CARD.headf, {
					[TARGETADJ_CARD.pk_org]: { value: record.refpk, display: record.refname }
				});
				let data = createHeadAfterEventData(
					props,
					TARGETADJ_CARD.cardpageid,
					TARGETADJ_CARD.formId,
					TARGETADJ_CARD.tableId,
					moduleId,
					key,
					value,
					userobject
				);

				ajax({
					url: TARGETADJ_CARD.orgChangEventURL,
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
							TARGETADJ_CARD.formId,
							TARGETADJ_CARD.tableId,
							res.data.data
						);
						props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
						buttonController.lineSelected.call(this);
						// props.form.focusFormNextItem(ATTRCODE.pk_org, TARGETADJ_CARD.forxmId, TARGETADJ_CARD.formId);暂时注释掉，在主组织改变后会自动调用日期组件
					}
				});
			}
		}
	}
}
