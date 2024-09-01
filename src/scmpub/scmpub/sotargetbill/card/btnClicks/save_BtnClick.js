/*
 * @PageInfo: 卡片页面 保存按钮事件
 * @Author: gaoxq
 * @Last Modified by: &Last Modified by&
 * @Last Modified time: &Last Modified time&
 * @Date: 2019-04-10 19:34:14
 */
import { TARGETBILL_CONST, BUTTONS, FIELD } from '../../const';
import buttonController from '../viewController/buttonController';
import { ajax } from 'nc-lightapp-front';
import { changeUrlParam, addCacheData, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showWarningDialog, showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function clickSaveBtn(props) {
	//过滤空行，数组中的是忽略的字段（无论这些字段有没有赋值都忽略）
	//根据表体的客户过滤空行
	props.cardTable.filterEmptyRows(TARGETBILL_CONST.tableId, [ FIELD.ccustomerid ], 'include');

	let tableData = props.cardTable.getVisibleRows(TARGETBILL_CONST.tableId);
	if (tableData.length == 0) {
		showWarningInfo(null, getLangByResId(this, '4001TARGETBILL-000011')); /* 国际化处理： 表体行不能为空！*/
		return;
	}
	let flag = props.validatePageToToast([
		{ name: TARGETBILL_CONST.formId, type: 'form' },
		{ name: TARGETBILL_CONST.tableId, type: 'cardTable' }
	]);
	if (!flag.allPassed) {
		return;
	}

	if ('3' == this.ctargetvalue.values.fcyclesetflag.value) {
		doSave.call(this, props);
	} else {
		let clinkyearitemidFlag = this.clinkyearitemidFlag;
		let isshow = false;
		let cmardimenname = null;
		tableData.some((row) => {
			let year = 0;
			let num = 0;
			Object.keys(row.values).forEach((key) => {
				if (key.includes('yeardynamic')) {
					year = parseFloat(row.values[key].value);
					// 用于当没有关联年指标时或年指标为 0 时，防止年指标的值为NaN导致后面无法判断
					if (isNaN(year)) {
						year = 0;
					}
				} else if (key.includes('dynamic')) {
					num = num + parseFloat(row.values[key].value);
				}
				// 防止 num 值为 NaN
				if (isNaN(num)) {
					num = 0;
				}
			});
			// 如果未关联年指标，则不进行提示
			if (!clinkyearitemidFlag) {
				isshow = false;
				cmardimenname = row.values.ccustomerid.display;
				return true;
			}
			if (year != num) {
				isshow = true;
				cmardimenname = row.values.ccustomerid.display;
				return true;
			}
		});
		if (isshow) {
			showWarningDialog(
				'',
				getLangByResId(this, '4001TARGETBILL-000023') +
					cmardimenname +
					getLangByResId(this, '4001TARGETBILL-000024') /* 国际化处理： 客户 ,  各期间指标值之和不等于年指标值，是否保存？*/,
				{
					beSureBtnClick: () => {
						doSave.call(this, props);
					},
					cancelBtnClick: () => {}
				}
			);
		} else {
			doSave.call(this, props);
		}
	}
}

function doSave(props) {
	let CardData = props.createMasterChildDataSimple(
		TARGETBILL_CONST.cardPageId,
		TARGETBILL_CONST.formId,
		TARGETBILL_CONST.tableId
	);
	let rows = CardData.body[TARGETBILL_CONST.tableId].rows;
	let newRows = [];
	rows.forEach((row, index) => {
		row.values.pseudocolumn = { value: index + '' };
		row.values.cmardimenid = CardData[TARGETBILL_CONST.formId].head.rows[0].values.cmardimenid;
		if (row.status != '3') {
			newRows.push(row);
		}
	});
	CardData.body[TARGETBILL_CONST.tableId].rows = newRows;
	let oldDbbill = this.oldbilldata;
	// CardData.card = oldDbbill;
	let url = TARGETBILL_CONST.saveUrl;
	this.props.validateToSave(CardData, () => {
		ajax({
			url: url,
			pageid: TARGETBILL_CONST.cardPageId,
			data: CardData,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				props.beforeUpdatePage();
				if (res.success && res.data) {
					if (res.data.head && res.data.head[TARGETBILL_CONST.formId]) {
						props.form.setAllFormValue({
							[TARGETBILL_CONST.formId]: res.data.head[TARGETBILL_CONST.formId]
						});
					}
					if (res.data.body && res.data.body[TARGETBILL_CONST.tableId]) {
						let fullTableData = props.cardTable.updateDataByRowId(
							TARGETBILL_CONST.tableId,
							res.data.body[TARGETBILL_CONST.tableId],
							true
						);
						res.data.body[TARGETBILL_CONST.tableId] = fullTableData;
					}
					let pk_targetbill = props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.pk_targetbill)
						.value;
					this.lastId = pk_targetbill;
					if (props.getUrlParam(TARGETBILL_CONST.id)) {
						changeUrlParam(props, { id: pk_targetbill, status: TARGETBILL_CONST.browse });
						updateCacheData(
							props,
							'pk_targetbill',
							pk_targetbill,
							res.data,
							TARGETBILL_CONST.formId,
							TARGETBILL_CONST.AdjustPromoteCacheKey
						);
					} else {
						changeUrlParam(props, { id: pk_targetbill, status: TARGETBILL_CONST.browse });
						addCacheData(
							props,
							'pk_targetbill',
							pk_targetbill,
							res.data,
							TARGETBILL_CONST.formId,
							TARGETBILL_CONST.AdjustPromoteCacheKey
						);
					}
					showSuccessInfo(getLangByResId(this, '4001TARGETBILL-000012')); /* 国际化处理： 保存成功！*/

					props.setUrlParam({
						status: TARGETBILL_CONST.browse,
						id: res.data.head[TARGETBILL_CONST.formId].rows[0].values.pk_targetbill.value
					});
					// 去除复选框的打钩
					props.cardTable.selectAllRows(TARGETBILL_CONST.tableId, false);
				}
				props.updatePage(TARGETBILL_CONST.formId, TARGETBILL_CONST.tableId);
				buttonController.call(this);
			}
		});
	});
}
