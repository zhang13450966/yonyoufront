/*
 * @Author: tianzhyw 
 * @PageInfo: 保存提交按钮
 * @Date: 2021-06-03 15:38:40 
 * @Last Modified by: tianzhyw 
 * @Last Modified time: 2021-06-03 15:38:40 
 */
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODES, FBILLSTATUS, ATTRCODE } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax } from 'nc-lightapp-front';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';

import {
	addCacheData,
	updateCacheData,
	deleteCacheData
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { checkDateUtil } from '../../../pub/utils/checkDateUtil';
import {
	showWarningDialog,
	showSaveAndCommitInfo,
	showWarningInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewControl';
import { pageInfoClick } from '../btnClicks';
export default function saveAndCommit(props, assign, skipCodes) {
	//过滤表格空行
	props.cardTable.filterEmptyRows(BUYINGREQ_CARD.tableId, [ ATTRCODES.pk_material ], 'include');
	if (!props.cardTable.getAllRows(BUYINGREQ_CARD.tableId).length) {
		showWarningInfo(null, getLangByResId(this, '4004PRAYBILLR-000013')); /* 国际化处理： 表体为空*/
		return;
	}
	let flag = this.props.validatePageToToast([
		{
			// creteForm 使用的areaCode
			name: [ BUYINGREQ_CARD.formId ],
			type: 'form'
		},
		{
			// createCardTable的areaCode，多页签区域填主表就行
			name: BUYINGREQ_CARD.tableId,
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}
	let msg = checkDateUtil.call(this, props);
	if (msg && msg.length > 0) {
		showWarningDialog(null, msg + getLangByResId(this, '4004PRAYBILLR-000014'), {
			/* 国际化处理： 是否继续保存？*/
			beSureBtnClick: backtotransfer.bind(this, this.props, skipCodes, assign)
		});
	} else {
		backtotransfer.call(this, this.props, skipCodes, assign);
	}
}

function backtotransfer(props, skipCodes, assign) {
	let _this = this;
	//自己的逻辑
	let data = props.createMasterChildDataSimple(
		BUYINGREQ_CARD.cardpageid,
		BUYINGREQ_CARD.formId,
		BUYINGREQ_CARD.tableId
	);

	let rows = [];
	data.body.card_body.rows.map((item, index) => {
		item.values.pseudocolumn.value = index + '';
		let sta = item.status;
		if (sta == 2) {
			item.values.pk_praybill.value = null;
			item.values.pk_praybill_b.value = null;
		}
		if (sta != 3) {
			rows.push(item);
		}
	});
	data.pageid = BUYINGREQ_CARD.cardpageid;
	data.templetid = this.state.templetid;
	let status = props.getUrlParam(BUYINGREQ_CARD.status);
	let channelType = _this.props.getUrlParam(BUYINGREQ_CARD.channelType);
	let transfer = this.props.getUrlParam(BUYINGREQ_CARD.type);
	if (channelType || transfer) {
		data.type = BUYINGREQ_CARD.transfer;
	} else {
		//data.type = BUYINGREQ_CARD.transfer;
	}
	//判断单据的表头pk是否存在，不存在是为新增
	let pk_praybillNewVerison = data.head.card_head.rows[0].values.pk_praybill.value;
	if (pk_praybillNewVerison) {
	} else {
		data.body.card_body.rows = rows;
	}
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	if (skipCodes instanceof Array) {
		data['skipCodes'] = skipCodes;
	} else {
		skipCodes = skipCodes ? [ skipCodes ] : new Array();
		data['skipCodes'] = skipCodes;
	}
	// for (let i = 0; i < skipCodes.length; i++) {
	// 	if (skipCodes[i] == 'PUBudgetControlCheckException') {
	// 		skipCodes[i] = 'BudgetControlCheck';
	// 	}
	// }
	this.props.cardTable.selectAllRows(BUYINGREQ_CARD.tableId, false);
	this.props.validateToSave(data, () => {
		ajax({
			url: BUYINGREQ_CARD.saveAndCommit,
			data: data,
			success: (res) => {
				props.beforeUpdatePage();
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				if (res.success) {
					if (res.data.isResume && res.data.isResume == true) {
						showResumeModal.bind(this)(
							props,
							'ResumeMessageDlg',
							skipCodes,
							res.data,
							saveAndCommit,
							props,
							assign
						);
						return false;
					}
					if (
						res.data &&
						res.data.workflow &&
						(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
					) {
						_this.skipCodes = data['skipCodes'];
						_this.setState({
							compositedata: res.data,
							compositedisplay: true,
							saveAndCommit: true
						});
						return;
					}

					if (res.data) {
						let pk_praybill;
						// let dataSource = BUYINGREQ_LIST.dataSource;
						if (res.data.body && res.data.body[BUYINGREQ_CARD.tableId]) {
							props.cardTable.setStatus(BUYINGREQ_CARD.tableId, BUYINGREQ_CARD.browse);
						}
						if (res.data.head && res.data.head[BUYINGREQ_CARD.formId]) {
							props.form.setAllFormValue({
								[BUYINGREQ_CARD.formId]: res.data.head[BUYINGREQ_CARD.formId]
							});
							let fbillstatus = res.data.head[BUYINGREQ_CARD.formId].rows[0].values.fbillstatus.value;
							pk_praybill = res.data.head[BUYINGREQ_CARD.formId].rows[0].values.pk_praybill.value;
							let billId = pk_praybill;
							let vbillcode = res.data.head[BUYINGREQ_CARD.formId].rows[0].values.vbillcode.value;
							let pk_srcpraybill =
								res.data.head[BUYINGREQ_CARD.formId].rows[0].values.pk_srcpraybill.value;
							// 上传附件时,不论版本,单据状态如何变化,保证附件关联的是原始主键
							if (pk_srcpraybill) {
								billId = pk_srcpraybill;
							}
							//订单编号
							_this.setState({
								vbillcode: vbillcode,
								billId: billId
							});
							if (fbillstatus == FBILLSTATUS.approved) {
								deleteCacheData(
									_this.props,
									ATTRCODE.pk_praybill,
									pk_praybillNewVerison,
									BUYINGREQ_LIST.dataSource
								);
								addCacheData(
									_this.props,
									ATTRCODE.pk_praybill,
									pk_praybill,
									res.data,
									BUYINGREQ_CARD.formId,
									BUYINGREQ_LIST.dataSource
								);
								// 更新翻页组件当前pk值
								props.cardPagination.setCardPaginationId({
									id: pk_praybill,
									status: 1
								});
								props.cardTable.setTableData(
									BUYINGREQ_CARD.tableId,
									res.data.body[BUYINGREQ_CARD.tableId],
									null,
									true,
									true
								);
								this.props.setUrlParam({ id: pk_praybill });
								pageInfoClick.call(_this, _this.props);
							} else {
								updateCacheData(
									_this.props,
									ATTRCODE.pk_praybill,
									pk_praybill,
									res.data,
									BUYINGREQ_CARD.formId,
									BUYINGREQ_LIST.dataSource
								);
							}
							// if (status == BUYINGREQ_CARD.add) {
							// 	//加入到缓存中
							// 	addCacheData(
							// 		props,
							// 		'pk_praybill',
							// 		pk_praybill,
							// 		res.data,
							// 		BUYINGREQ_CARD.formId,
							// 		dataSource
							// 	);
							// 	// 更新翻页组件当前pk值
							// 	props.cardPagination.setCardPaginationId({
							// 		id: pk_praybill,
							// 		status: 1
							// 	});
							// } else if (status == BUYINGREQ_CARD.edit) {
							// 	updateCacheData(
							// 		props,
							// 		'pk_praybill',
							// 		pk_praybill,
							// 		res.data,
							// 		BUYINGREQ_CARD.formId,
							// 		dataSource
							// 	);
							// }
						}
						props.pushTo(BUYINGREQ_CARD.cardUrl, {
							status: BUYINGREQ_CARD.browse,
							id: pk_praybill
						});
						let fbillstatus = res.data.head[BUYINGREQ_CARD.formId].rows[0].values.fbillstatus.value;
						//设置按钮显示
						buttonController.setButtonByStatus.call(_this, _this.props, fbillstatus);
						buttonController.setCardPaginationVisible(this.props, true); //设置翻页显示
						_this.toggleShow();
						buttonController.lineSelected.call(_this, props);
						_this.skipCodes = [];
						showSaveAndCommitInfo();
					}
				}
				props.updatePage(BUYINGREQ_CARD.formId, BUYINGREQ_CARD.tableId);
			}
		});
	});
}
