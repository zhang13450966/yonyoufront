/*
 * @Author: zhangchangqing 
 * @PageInfo: 保存按钮事件
 * @Date: 2018-04-19 10:35:13 
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-09-28 10:59:53
 */
import { STOREREQ_CARD, ATTRCODE, STOREREQ_LIST, ATTRCODES } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import {
	addCacheData,
	updateCacheData,
	rewriteTransferSrcBids
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showSuccessInfo, showErrorInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
export default function clickSaveBtn(props, skipCodes, callback) {
	//过滤表格空行

	let _this = this;
	props.cardTable.filterEmptyRows(STOREREQ_CARD.tableId, [ ATTRCODES.pk_material ], 'include');
	if (!props.cardTable.getAllRows(STOREREQ_CARD.tableId).length) {
		showWarningInfo(null, getLangByResId(this, '4004STOREREQ-000013')); /* 国际化处理： 表体为空*/
		return;
	}
	let flag = props.validatePageToToast([
		{
			// creteForm 使用的areaCode
			name: [ STOREREQ_CARD.formId ],
			type: 'form'
		},
		{
			// createCardTable的areaCode，多页签区域填主表就行
			name: STOREREQ_CARD.tableId,
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}
	let { addCacheId } = this.props.table;
	let data = props.createMasterChildDataSimple(STOREREQ_CARD.cardpageid, STOREREQ_CARD.formId, STOREREQ_CARD.tableId);
	let rows = [];
	data.body.card_body.rows.map((item, index) => {
		//伪列
		item.values.pseudocolumn.value = index + '';
		let sta = item.status;
		if (sta == 2) {
			item.values.pk_storereq.value = null;
			item.values.pk_storereq_b.value = null;
		}
		if (sta != 3) {
			rows.push(item);
		}
	});

	data.pageid = STOREREQ_CARD.cardpageid;
	data.templetid = this.state.templetid;
	skipCodes = skipCodes ? skipCodes : new Array();
	data['skipCodes'] = skipCodes;
	let status = props.getUrlParam(STOREREQ_CARD.status);
	if (!status) {
		status = 'add';
	}
	let url = STOREREQ_CARD.newSaveURL;
	//判断单据的表头pk是否存在，不存在是为新增
	let pk_storereq = data.head.card_head.rows[0].values.pk_storereq.value;
	if (pk_storereq) {
		url = STOREREQ_CARD.saveURL;
	} else {
		url = STOREREQ_CARD.newSaveURL;
		data.body.card_body.rows = rows;
	}

	//暂存保存
	let tempsave = getDefData(STOREREQ_CARD.tempCardCacheKey, 'tempsave');

	//暂存保存，将表头设置为新增
	if (tempsave) {
		data.head.card_head.rows[0].status = '2';
		url = STOREREQ_CARD.newSaveURL;
	}

	let transfer = this.props.getUrlParam(STOREREQ_CARD.type);
	if (transfer) {
		data.type = STOREREQ_CARD.transfer;
	} else {
		//data.type = STOREREQ_CARD.transfer;
	}
	//data.body[STOREREQ_CARD.tableId] = simplifyData(data.body[STOREREQ_CARD.tableId]);
	this.props.cardTable.selectAllRows(STOREREQ_CARD.tableId, false);
	this.props.validateToSave(data, () => {
		ajax({
			url: url,
			data: data,
			success: (res) => {
				this.props.beforeUpdatePage();
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				let pk_storereq = null;

				if (res.data.isResume && res.data.isResume == true) {
					showResumeModal.bind(this)(props, 'ResumeMessageDlg', skipCodes, res.data, clickSaveBtn, props);
					return;
				} else {
					if (res.success) {
						if (res.data) {
							if (res.data.body && res.data.body[STOREREQ_CARD.tableId]) {
								let fullTableData = props.cardTable.updateDataByRowId(
									STOREREQ_CARD.tableId,
									res.data.body[STOREREQ_CARD.tableId],
									true
								);
								if (!transfer) {
									res.data.body[STOREREQ_CARD.tableId] = fullTableData;
								}
							}
							if (res.data.head && res.data.head[STOREREQ_CARD.formId]) {
								props.form.setAllFormValue({
									[STOREREQ_CARD.formId]: res.data.head[STOREREQ_CARD.formId]
								});
								pk_storereq = res.data.head[STOREREQ_CARD.formId].rows[0].values.pk_storereq.value;
								let vbillcode = res.data.head[STOREREQ_CARD.formId].rows[0].values.vbillcode.value;
								if (status == STOREREQ_CARD.add) {
									//订单编号
									_this.setState({
										vbillcode: vbillcode,
										billId: pk_storereq
									});
									//加入到缓存中
									// addCacheId(STOREREQ_CARD.formId, pk_storereq);
									addCacheData(
										props,
										ATTRCODE.pk_storereq,
										pk_storereq,
										res.data,
										STOREREQ_CARD.formId,
										STOREREQ_LIST.dataSource
									);
									// 更新翻页组件当前pk值
									props.cardPagination.setCardPaginationId({
										id: pk_storereq,
										status: 1
									});
								} else if (status == STOREREQ_CARD.edit) {
									updateCacheData(
										props,
										ATTRCODE.pk_storereq,
										pk_storereq,
										res.data,
										STOREREQ_CARD.formId,
										STOREREQ_LIST.dataSource
									);
								}
							}
							if (transfer) {
								if (callback) {
									//如果是拉单或者推单情况下得保存提交，保存成功后先不处理切换条数操作（在提交里处理）
									_this.indexstatus[this.curindex] = 'browse';
									rewriteTransferSrcBids(
										props,
										ATTRCODES.csourcebid,
										res.data.body[STOREREQ_CARD.tableId].rows
									);
									this.toggleShow();
									callback.call(this, this.props);
								} else {
									//转单
									_this.props.transferTable.setTransformFormStatus(STOREREQ_CARD.leftarea, {
										status: true,
										onChange: (current, next, currentIndex) => {
											_this.props.transferTable.setTransferListValueByIndex(
												STOREREQ_CARD.leftarea,
												res.data,
												currentIndex
											);

											let cacheData = _this.props.transferTable.updateTransferListValueByIndex(
												STOREREQ_CARD.leftarea,
												res.data,
												currentIndex
											);
											_this.indexstatus[currentIndex] = 'browse';
											rewriteTransferSrcBids(
												props,
												ATTRCODES.csourcebid,
												cacheData.body[STOREREQ_CARD.tableId].rows
											);
											//更新缓存
											//cachedata.call(_this, STOREREQ_CARD.tableId);
										}
									});
								}
							} else {
								props.pushTo(STOREREQ_CARD.cardUrl, {
									status: STOREREQ_CARD.browse,
									id: pk_storereq,
									pagecode: STOREREQ_CARD.cardpageid
								});
								this.toggleShow();
								// 提交回调
								if (callback) {
									callback.call(this, this.props);
								}
							}
						}
						showSuccessInfo(getLangByResId(this, '4004STOREREQ-000039') /* 国际化处理： 保存成功！*/);
					}
				}
				this.props.updatePage(STOREREQ_CARD.formId, STOREREQ_CARD.tableId);
			}
		});
	});

	setDefData(STOREREQ_CARD.tempCardCacheKey, 'tempsave', false);
}
