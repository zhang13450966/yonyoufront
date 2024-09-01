/*
 * @Author: 刘奇 
 * @PageInfo: 卡片保存按钮点击事件
 * @Date: 2019-03-12 16:57:04 
 * @Last Modified by: zhangllb
 * @Last Modified time: 2022-06-13 11:16:08
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem, ArsubBodyItem } from '../../const';
import buttonController from '../viewController/buttonController';
import {
	changeUrlParam,
	addCacheData,
	updateCacheData,
	rewriteTransferSrcBids
} from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { getDefData, setDefData } from '../../../pub/cache';

export default function buttonClick(props, skipCodes, assign, callback) {
	skipCodes = skipCodes ? skipCodes : new Array();
	// 过滤表格空行（排除新增时某些字段有默认值）
	const defaultValueField = [ ArsubBodyItem.norigarsubmny ];
	// 新增时赋默认值的字段：财务组织、集团、费用承担组织、单据日期
	props.cardTable.filterEmptyRows(ARSUB_CONST.tableId, defaultValueField, 'include');

	//必输项校验
	let flag = this.props.validatePageToToast([
		{
			name: ARSUB_CONST.formId,
			type: 'form'
		},
		{
			name: ARSUB_CONST.tableId,
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}

	let arsubVO = props.createMasterChildDataSimple(ARSUB_CONST.cardPageId, ARSUB_CONST.formId, ARSUB_CONST.tableId);

	let rows = arsubVO.body[ARSUB_CONST.tableId].rows;
	rows.forEach((row, index) => {
		row.values.pseudocolumn = { value: index + '' }; // 过滤掉已删的行
	});

	arsubVO.body[ARSUB_CONST.tableId].rows = rows;

	//复制保存时，设置表头状态为新增状态,表体状态为0的改成新增状态2
	let data = props.createExtCardData(ARSUB_CONST.cardPageId, ARSUB_CONST.formId, ARSUB_CONST.tableId);
	let option = this.props.getUrlParam('status');
	if (option == 'Copy' && !data.head.head.rows[0].values[ArsubHeadItem.carsubid].value) {
		data.head.head.rows[0].status = '2';
		let newRowStatus = [];
		arsubVO.body[ARSUB_CONST.tableId].rows.forEach((row) => {
			if (row.status == '0') {
				row.status = '2';
			}
			newRowStatus.push(row);
		});
		arsubVO.body[ARSUB_CONST.tableId].rows = newRowStatus;
	}

	// 新增保存，需要把删除的行剔除掉
	if (arsubVO.head[ARSUB_CONST.formId].rows[0].status == '2') {
		let newRows = [];
		arsubVO.body[ARSUB_CONST.tableId].rows.forEach((row) => {
			if (row.status != '3') {
				newRows.push(row);
			}
		});
		arsubVO.body[ARSUB_CONST.tableId].rows = newRows;
	}

	props.cardTable.selectAllRows(ARSUB_CONST.tableId, false);
	let cacheData = getDefData(ARSUB_CONST.ArsubCacheKey, 'settleExeVOs');
	let param = {
		arsubVO: arsubVO,
		settleExeVOs: cacheData
	};
	param['skipCodes'] = skipCodes;
	props.validateToSave(arsubVO, () => {
		ajax({
			url: ARSUB_CONST.saveUrl,
			pageid: ARSUB_CONST.cardPageId,
			//data: arsubVO,
			data: param,
			success: (res) => {
				if (res.data.isResume && res.data.isResume == true) {
					showResumeModal.bind(this)(
						props,
						'MessageDlg',
						skipCodes,
						res.data,
						buttonClick.bind(this, props, skipCodes, assign, callback),
						props
					);
					return;
				} else {
					let carsubid = null;
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(res.formulamsg);
					}
					if (res.success && res.data) {
						carsubid = res.data.head[ARSUB_CONST.formId].rows[0].values[ArsubHeadItem.carsubid].value;
						let flag = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value;
						// 关闭更新平台组件setState开关
						this.props.beforeUpdatePage();
						let bill = res.data;
						if (res.data.head && res.data.body) {
							// carsubid = res.data.head[ARSUB_CONST.formId].rows[0].values[ArsubHeadItem.carsubid].value;
							this.props.form.setAllFormValue({
								[ARSUB_CONST.formId]: bill.head[ARSUB_CONST.formId]
							});
							let fullTableData = this.props.cardTable.updateDataByRowId(
								ARSUB_CONST.tableId,
								bill.body[ARSUB_CONST.tableId],
								true
							);
							bill.body[ARSUB_CONST.tableId] = fullTableData;
						}
						// let pk = props.getUrlParam('id');
						if (flag) {
							// 修改保存
							changeUrlParam(props, { id: carsubid, status: ARSUB_CONST.browse });
							updateCacheData(
								props,
								ArsubHeadItem.carsubid,
								carsubid,
								bill,
								ARSUB_CONST.formId,
								ARSUB_CONST.ArsubCacheKey
							);
						} else {
							// 新增保存
							changeUrlParam(props, { id: carsubid, status: ARSUB_CONST.browse });
							addCacheData(
								props,
								ArsubHeadItem.carsubid,
								carsubid,
								bill,
								ARSUB_CONST.formId,
								ARSUB_CONST.ArsubCacheKey
							);
							// 更新翻页组件当前pk值
							props.cardPagination.setCardPaginationId({
								id: carsubid,
								status: 1
							});
						}

						let vbillcode = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.vbillcode).value;
						props.BillHeadInfo.setBillHeadInfoVisible({
							showBillCode: true,
							billCode: vbillcode
						});

						let transfer = props.getUrlParam('buttonType');
						if (transfer != undefined && transfer.indexOf('ref') != -1) {
							rewriteTransferSrcBids(
								props,
								ArsubBodyItem.csrcbid,
								res.data.body[ARSUB_CONST.tableId].rows
							);
							if (callback) {
								callback.call(this, props, null, skipCodes, (newCard) => {
									props.transferTable.setTransformFormStatus(ARSUB_CONST.left, {
										status: true,
										onChange: (current, next, currentIndex) => {
											props.transferTable.setTransferListValueByIndex(
												ARSUB_CONST.left,
												newCard,
												currentIndex
											);
										}
									});
								});
							} else {
								props.transferTable.setTransformFormStatus(ARSUB_CONST.left, {
									status: true,
									onChange: (current, next, currentIndex) => {
										props.transferTable.setTransferListValueByIndex(
											ARSUB_CONST.left,
											res.data,
											currentIndex
										);
									}
								});
							}
						} else {
							if (callback) {
								callback.call(this, props, null, skipCodes);
							}
						}
						buttonController.call(this, this.props);
						this.props.updatePage(ARSUB_CONST.formId, ARSUB_CONST.tableId);
						showSuccessInfo(getLangByResId(this, '4006ARSUB-000006')); /* 国际化处理： 保存成功！*/
					}
				}
			}
		});
	});
}
