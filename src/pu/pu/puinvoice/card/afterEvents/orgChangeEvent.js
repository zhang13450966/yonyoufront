/*
 * @Author: jiangfw
 * @PageInfo: 主组织编辑后事件
 * @Date: 2018-04-11 17:51:16 
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-09-29 16:37:31
 */
import { ajax } from 'nc-lightapp-front';
import { URL, BUTTONID, FIELD, PAGECODE, AREA, COMMON } from '../../constance';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { showWarningDialog, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function afterEvent(moduleId, key, value, changedrows, record, areaIds) {
	let props = this.props;
	let headArea = areaIds.headArea;
	let bodyArea = areaIds.bodyArea;

	if (value.value == null || value == '' || value instanceof Array || Object.keys(value.value).length === 0) {
		// 清空组织
		showWarningDialog(
			getLangByResId(this, '4004PUINVOICE-000069') /* 国际化处理： 确认修改*/,
			getLangByResId(this, '4004PUINVOICE-000001') /* 国际化处理： 清空组织，这样会清空您录入的信息？*/,
			{
				beSureBtnClick: () => {
					// 1、采购组织为空时清空表单数据且表体不可编辑
					props.form.EmptyAllFormValue(headArea);
					setTimeout(() => {
						//执行跳出堆栈
						props.cardTable.setTableData(bodyArea, { rows: [] });
						// 默认表体增一行
						// props.cardTable.addRow(bodyArea);
						// RownoUtils.setRowNo(props, this.tableId, FIELD.crowno);
					}, 0);
					props.initMetaByPkorg(FIELD.pk_org_v);
					props.button.setButtonDisabled([ BUTTONID.AddLine ], true);
				},
				cancelBtnClick: () => {
					props.form.setFormItemsValue(headArea, {
						[FIELD.pk_org_v]: { value: changedrows.value, display: changedrows.display }
					});
				}
			}
		);
	} else {
		//2、不为空时释放页面编辑性同时判断和旧值不相等清空表体数据
		// props.resMetaAfterPkorgEdit();
		if (changedrows && value.value != changedrows.value && changedrows.value) {
			// 修改组织
			showWarningDialog(
				getLangByResId(this, '4004PUINVOICE-000069') /* 国际化处理： 确认修改*/,
				getLangByResId(this, '4004PUINVOICE-000001') /* 国际化处理： 是否修改组织，这样会清空您录入的信息？*/,
				{
					beSureBtnClick: () => {
						props.form.EmptyAllFormValue(headArea);
						setTimeout(() => {
							//执行跳出堆栈
							props.cardTable.setTableData(bodyArea, { rows: [] });
							// 默认表体增一行
							props.cardTable.addRow(bodyArea);
							RownoUtils.setRowNo(props, this.tableId, FIELD.crowno);
						}, 0);

						props.form.setFormItemsValue(headArea, {
							[FIELD.pk_org_v]: { value: value.value, display: value.display }
						});
						getAfterData.call(this, moduleId, key, value, areaIds);
						transtypeUtils.setValue.call(this, moduleId, FIELD.ctrantypeid, FIELD.vtrantypecode);
					},
					cancelBtnClick: () => {
						props.form.setFormItemsValue(headArea, {
							[FIELD.pk_org_v]: { value: changedrows.value, display: changedrows.display }
						});
					}
				}
			);
		} else {
			props.form.setFormItemsValue(headArea, {
				[FIELD.pk_org_v]: { value: record.refpk, display: record.refname }
			});
			// 默认表体增一行
			props.cardTable.addRow(bodyArea);
			RownoUtils.setRowNo(props, this.tableId, FIELD.crowno);
			getAfterData.call(this, moduleId, key, value, areaIds);
			// transtypeUtils.setValue.call(this, moduleId, FIELD.ctrantypeid, FIELD.vtrantypecode);
		}
	}
}

/**
 * 更新state
 */
function updateState(_this, pk_org) {
	_this.setState({ pk_org: pk_org });
}

//组织切换处理
function getAfterData(moduleId, key, value, areaIds) {
	let headArea = areaIds.headArea;
	let bodyArea = areaIds.bodyArea;
	//表体按钮不可用
	// let aggvo = this.props.createHeadAfterEventData(PAGECODE.invoiceCard, headArea, bodyArea, moduleId, key, value);
	let aggvo = createHeadAfterEventData(this.props, PAGECODE.invoiceCard, headArea, bodyArea, moduleId, key, value);
	// let pk_org_v_v = aggvo.newvalue.refpk;
	// let pk_org_v_d = aggvo.newvalue.display;
	let pk_org_v_v = value.value;
	let pk_org_v_d = value.display;

	let _this = this;
	ajax({
		url: URL.afterEditHead,
		data: aggvo,
		mode: 'normal',
		// async: true,
		async: false,
		success: (res) => {
			// let data = res.data;
			let data = res;
			//清空表头
			//_this.props.form.EmptyAllFormValue(moduleId);
			// if (!res.data.success) {
			if (!res.success) {
				_this.props.form.setFormItemsDisabled(moduleId, { pk_org_v: false });
				let errMsg = null;
				if (res.data.error && res.data.error.message) {
					errMsg = res.data.error.message;
				}
				showErrorInfo(getLangByResId(_this, '4004PUINVOICE-000064') /* 国际化处理： 出错啦！*/, errMsg);
			} else if (
				data &&
				data.data &&
				data.data.billCard &&
				data.data.billCard.head &&
				data.data.billCard.head[headArea]
			) {
				// // 默认表体增一行
				// _this.props.cardTable.addRow(bodyArea);
				// RownoUtils.setRowNo(_this.props, _this.tableId, FIELD.crowno);
				// //放开其他字段编辑性
				// _this.props.resMetaAfterPkorgEdit();
				// _this.props.button.setDisabled({ [BUTTONID.AddLine]: false });
				// let headvo = data.data.billCard.head[headArea];
				// setTimeout(() => {
				// _this.props.form.setAllFormValue({ [headArea]: headvo });
				// 	let pk_org = _this.props.form.getFormItemsValue(headArea, FIELD.pk_org).value;
				// 	updateState(_this, pk_org);
				// }, 0);

				data.data.billCard.head[AREA.card_head].rows[0].values[FIELD.pk_org_v] = {
					value: pk_org_v_v,
					display: pk_org_v_d,
					scale: '-1'
				};
				processBillCardHeadEditResult(_this.props, AREA.card_head, AREA.card_body, data.data);
				// _this.props.form.setFormItemsValue(AREA.card_head, {
				// [FIELD.pk_org_v]: {
				// 	value: pk_org_v_v,
				// 	display: pk_org_v_d,
				// 	scale: '-1'
				// }
				// });

				// let headvo = data.data.billCard.head[headArea];
				// _this.props.form.setAllFormValue({ [headArea]: headvo });
				// 默认表体增一行
				// _this.props.cardTable.addRow(bodyArea);
				// RownoUtils.setRowNo(_this.props, _this.tableId, FIELD.crowno);
				//放开其他字段编辑性
				// _this.props.resMetaAfterPkorgEdit();
				setTimeout(() => {
					_this.props.resMetaAfterPkorgEdit();
				}, 0);
				_this.props.button.setDisabled({ [BUTTONID.AddLine]: false });
				let pk_org = _this.props.form.getFormItemsValue(headArea, FIELD.pk_org).value;
				updateState(_this, pk_org);
				// }, 0);

				transtypeUtils.setValue.call(_this, moduleId, FIELD.ctrantypeid, FIELD.vtrantypecode);
				let transtypecode = getDefData(COMMON.PuinvoiceCacheKey, 'transtypecode');
				if (transtypecode) {
					let billtypeid = getDefData(COMMON.PuinvoiceCacheKey, 'billtypeid');
					let billtypename = getDefData(COMMON.PuinvoiceCacheKey, 'billtypename');
					_this.props.form.setFormItemsValue(this.formId, {
						[FIELD.ctrantypeid]: { value: billtypeid, display: billtypename },
						[FIELD.vtrantypecode]: { value: transtypecode, display: transtypecode }
					});
				}
			}
		}
	});
}
