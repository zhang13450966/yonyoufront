/*
 * @Author: 刘奇 
 * @PageInfo: 卡片保存按钮点击事件
 * @Date: 2019-03-12 16:57:04 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-07-22 10:22:41
 */

import { ajax } from 'nc-lightapp-front';
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, PrepaidinvoiceBodyItem } from '../../const';
import buttonController from '../viewController/buttonController';
import { changeUrlParam, addCacheData, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props, skipCodes, callback) {
	// 过滤表格空行（排除新增时某些字段有默认值）
	const defaultValueField = [
		PrepaidinvoiceBodyItem.crowno,
		PrepaidinvoiceBodyItem.pk_org,
		PrepaidinvoiceBodyItem.dbilldate,
		PrepaidinvoiceBodyItem.pk_group,
		'pseudocolumn',
		'cinvoice_hid',
		'crowno',
		'numberindex'
	];
	// 新增时赋默认值的字段：财务组织、集团、单据日期
	props.cardTable.filterEmptyRows(PREPAIDINVOICE_CONST.tableId, defaultValueField, 'except');
	let flag = props.validatePageToToast([
		{ name: PREPAIDINVOICE_CONST.formId, type: 'form' },
		{ name: PREPAIDINVOICE_CONST.tableId, type: 'cardTable' }
	]);
	if (!flag.allPassed) {
		return;
	}
	let prepaidinvoiceVO = props.createMasterChildDataSimple(
		PREPAIDINVOICE_CONST.cardPageId,
		PREPAIDINVOICE_CONST.formId,
		PREPAIDINVOICE_CONST.tableId
	);
	let rows = prepaidinvoiceVO.body[PREPAIDINVOICE_CONST.tableId].rows;
	let isfull = true;
	rows.forEach((row, index) => {
		if (row.status != 3) {
			isfull = false;
			row.values.pseudocolumn = { value: index + '' }; //过滤掉已删的行
		}
	});

	if (isfull) {
		showErrorInfo(null, getLangByResId(this, '4006PREPAIDINVOICE-000033')); /* 国际化处理： 表体不能为空*/
		return;
	}
	prepaidinvoiceVO.body[PREPAIDINVOICE_CONST.tableId].rows = rows;
	// 新增保存，需要把删除的行剔除掉
	if (prepaidinvoiceVO.head[PREPAIDINVOICE_CONST.formId].rows[0].status == '2') {
		let newRows = [];
		prepaidinvoiceVO.body[PREPAIDINVOICE_CONST.tableId].rows.forEach((row) => {
			if (row.status != '3') {
				newRows.push(row);
			}
		});
		prepaidinvoiceVO.body[PREPAIDINVOICE_CONST.tableId].rows = newRows;
	}
	props.cardTable.selectAllRows(PREPAIDINVOICE_CONST.tableId, false);
	//运输单拉单是回写ID
	let transfer = props.getUrlParam('buttonType');
	let rewriteId = [];
	if (transfer != undefined && transfer == 'ref4804') {
		let ctakefeeid = prepaidinvoiceVO.head[PREPAIDINVOICE_CONST.formId].rows[0].values.ctakefeeid;
		prepaidinvoiceVO.body[PREPAIDINVOICE_CONST.tableId].rows.forEach((item) => {
			rewriteId.push(item.values.csrcid + '_' + ctakefeeid);
		});
	}

	props.validateToSave(prepaidinvoiceVO, () => {
		ajax({
			url: PREPAIDINVOICE_CONST.saveUrl,
			pageid: PREPAIDINVOICE_CONST.cardPageId,
			data: prepaidinvoiceVO,
			success: (res) => {
				let hid = null;
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				if (res.success && res.data) {
					// 关闭更新平台组件setState开关
					this.props.beforeUpdatePage();
					let bill = res.data;
					if (bill.head && bill.body) {
						hid = bill.head[PREPAIDINVOICE_CONST.formId].rows[0].values[PrepaidinvoiceHeadItem.hid].value;
						this.props.form.setAllFormValue({
							[PREPAIDINVOICE_CONST.formId]: bill.head[PREPAIDINVOICE_CONST.formId]
						});
						let fullTableData = this.props.cardTable.updateDataByRowId(
							PREPAIDINVOICE_CONST.tableId,
							bill.body[PREPAIDINVOICE_CONST.tableId],
							true
						);
						bill.body[PREPAIDINVOICE_CONST.tableId] = fullTableData;
					}

					let pk = props.getUrlParam('id');
					if (pk) {
						// 修改保存
						changeUrlParam(props, { id: hid, status: PREPAIDINVOICE_CONST.browse });
						updateCacheData(
							props,
							PrepaidinvoiceHeadItem.hid,
							hid,
							bill,
							PREPAIDINVOICE_CONST.formId,
							PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey
						);
					} else {
						// 新增保存
						changeUrlParam(props, { id: hid, status: PREPAIDINVOICE_CONST.browse });
						addCacheData(
							props,
							PrepaidinvoiceHeadItem.hid,
							hid,
							bill,
							PREPAIDINVOICE_CONST.formId,
							PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey
						);
						// 更新翻页组件当前pk值
						props.cardPagination.setCardPaginationId({
							id: hid,
							status: 1
						});
					}

					let vbillcode = props.form.getFormItemsValue(
						PREPAIDINVOICE_CONST.formId,
						PrepaidinvoiceHeadItem.vbillcode
					).value;
					props.BillHeadInfo.setBillHeadInfoVisible({
						showBillCode: true,
						billCode: vbillcode
					});
					if (transfer != undefined && transfer.indexOf('ref') != -1) {
						//回写经特殊处理的主键
						if (transfer == 'ref4804') {
							props.transferTable.setSavedTransferTableDataPk(rewriteId);
						}
						if (callback) {
							callback.call(this, props, null, skipCodes, (newCard) => {
								props.transferTable.setTransformFormStatus(PREPAIDINVOICE_CONST.left, {
									status: true,
									onChange: (current, next, currentIndex) => {
										props.transferTable.setTransferListValueByIndex(
											PREPAIDINVOICE_CONST.left,
											newCard,
											currentIndex
										);
									}
								});
							});
						} else {
							props.transferTable.setTransformFormStatus(PREPAIDINVOICE_CONST.left, {
								status: true,
								onChange: (current, next, currentIndex) => {
									props.transferTable.setTransferListValueByIndex(
										PREPAIDINVOICE_CONST.left,
										res.data,
										currentIndex
									);
								}
							});
						}
					} else {
						if (callback) {
							callback.call(this, props, skipCodes);
						}
					}
					buttonController.call(this, this.props);
					this.props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
					showSuccessInfo(getLangByResId(this, '4006PREPAIDINVOICE-000006')); /* 国际化处理： 保存成功！*/
				}
			}
		});
	});
}
