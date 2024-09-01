/*
 * @Author: zhangchangqing 
 * @PageInfo: 保存按钮事件
 * @Date: 2018-04-19 10:35:13 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-06-23 15:03:57
 */
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODE, ATTRCODES } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax, broadcast } from 'nc-lightapp-front';
import {
	addCacheData,
	updateCacheData,
	rewriteTransferSrcBids
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { checkDateUtil } from '../../../pub/utils/checkDateUtil';
//import { cachedata } from '../afterEvents/headAfterEvent';
import { showWarningDialog, showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
let tableId = BUYINGREQ_CARD.tableId; //body
let formId = BUYINGREQ_CARD.formId; //head
let cardpageid = BUYINGREQ_CARD.cardpageid; //BUYINGREQ_CARD
export default function clickSaveBtn(props, callback) {
	//过滤表格空行

	props.cardTable.filterEmptyRows(tableId, [ ATTRCODES.pk_material ], 'include');
	if (!props.cardTable.getAllRows(tableId).length) {
		showWarningInfo(null, getLangByResId(this, '4004PRAYBILL-000021')); /* 国际化处理： 表体为空*/
		return;
	}
	let flag = this.props.validatePageToToast([
		{
			// creteForm 使用的areaCode
			name: [ formId ],
			type: 'form'
		},
		{
			// createCardTable的areaCode，多页签区域填主表就行
			name: tableId,
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}
	let msg = checkDateUtil.call(this, props);
	if (msg && msg.length > 0) {
		showWarningDialog(null, msg + getLangByResId(this, '4004PRAYBILL-000022'), {
			/* 国际化处理： 是否继续保存？*/
			beSureBtnClick: backtotransfer.bind(this, props, callback)
		});
	} else {
		backtotransfer.call(this, props, callback);
	}
}
function backtotransfer(props, callback) {
	let _this = this;
	//自己的逻辑
	let data = props.createMasterChildDataSimple(cardpageid, formId, tableId);
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
	data.pageid = cardpageid;
	data.templetid = this.state.templetid;
	let status = props.getUrlParam(BUYINGREQ_CARD.status);
	let { addCacheId } = this.props.table;
	let url = '';
	let channelType = _this.props.getUrlParam(BUYINGREQ_CARD.channelType);
	let transfer = this.props.getUrlParam(BUYINGREQ_CARD.type);
	if (channelType || transfer) {
		data.type = BUYINGREQ_CARD.transfer;
	} else {
		//data.type = BUYINGREQ_CARD.transfer;
	}
	//判断单据的表头pk是否存在，不存在是为新增
	let orgpk_praybill = data.head.card_head.rows[0].values.pk_praybill.value;

	//判断单据的表头pk是否存在，不存在是为新增
	let pk_praybill = data.head.card_head.rows[0].values.pk_praybill.value;
	if (pk_praybill) {
		url = BUYINGREQ_CARD.saveURL;
	} else {
		url = BUYINGREQ_CARD.newSaveURL;
		data.body.card_body.rows = rows;
	}

	//暂存保存
	let tempsave = getDefData(BUYINGREQ_CARD.tempCardCacheKey, 'tempsave');

	//暂存保存，将表头设置为新增
	if (tempsave) {
		data.head.card_head.rows[0].status = '2';
		url = BUYINGREQ_CARD.newSaveURL;
	}

	//data.body[tableId] = simplifyData(data.body[tableId]);
	this.props.cardTable.selectAllRows(BUYINGREQ_CARD.tableId, false);
	this.props.validateToSave(data, () => {
		ajax({
			url: url,
			data: data,
			success: (res) => {
				this.props.beforeUpdatePage();
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				let pk_praybill = null;
				if (res.success) {
					if (res.data) {
						//如果是转单，设置转单的缓存
						let dataSource = BUYINGREQ_LIST.dataSource;
						if (transfer) {
							//dataSource = BUYINGREQ_LIST.transferDataSource;
						}
						if (channelType == BUYINGREQ_CARD.replenishmentarrange) {
							dataSource = BUYINGREQ_CARD.channelTypeDataSource1;
						} else if (channelType == BUYINGREQ_CARD.directarrange) {
							dataSource = BUYINGREQ_CARD.channelTypeDataSource2;
						}
						if (res.data.body && res.data.body[BUYINGREQ_CARD.tableId]) {
							let fullTableData = props.cardTable.updateDataByRowId(
								BUYINGREQ_CARD.tableId,
								res.data.body[BUYINGREQ_CARD.tableId],
								true
							);
							if (!transfer && !channelType) {
								res.data.body[BUYINGREQ_CARD.tableId] = fullTableData;
							}
							props.cardTable.setStatus(BUYINGREQ_CARD.tableId, BUYINGREQ_CARD.browse);
						}
						if (res.data.head && res.data.head[formId]) {
							props.form.setAllFormValue({ [formId]: res.data.head[formId] });
							pk_praybill = res.data.head[formId].rows[0].values.pk_praybill.value;
							let vbillcode = res.data.head[formId].rows[0].values.vbillcode.value;
							if (status == BUYINGREQ_CARD.add) {
								//订单编号
								_this.setState({
									vbillcode: vbillcode,
									billId: pk_praybill
								});
								//加入到缓存中
								// addCacheId(formId, pk_praybill);
								//addCache(pk_praybill, res.data, BUYINGREQ_CARD.formId, BUYINGREQ_LIST.dataSource);
								if (!orgpk_praybill) {
									addCacheData(
										props,
										'pk_praybill',
										pk_praybill,
										res.data,
										BUYINGREQ_CARD.formId,
										dataSource
									);
								} else {
									updateCacheData(
										props,
										'pk_praybill',
										pk_praybill,
										res.data,
										BUYINGREQ_CARD.formId,
										dataSource
									);
								}

								// 更新翻页组件当前pk值
								props.cardPagination.setCardPaginationId({
									id: pk_praybill,
									status: 1
								});
							} else if (status == BUYINGREQ_CARD.edit) {
								updateCacheData(
									props,
									'pk_praybill',
									pk_praybill,
									res.data,
									BUYINGREQ_CARD.formId,
									dataSource
								);
							}
						}

						if (transfer || channelType) {
							if (callback) {
								//如果是拉单或者推单情况下得保存提交，保存成功后先不处理切换条数操作（在提交里处理）
								_this.indexstatus[this.curindex] = 'browse';
								if (transfer) {
									rewriteTransferSrcBids(
										props,
										ATTRCODES.csourcebid,
										res.data.body[BUYINGREQ_CARD.tableId].rows
									);
									this.toggleShow();
									callback.call(this, this.props);
								} else if (channelType) {
									let srcbids = [];
									res.data.body[BUYINGREQ_CARD.tableId].rows.forEach((row) => {
										srcbids.push(row.values[ATTRCODES.csourcebid].value);
									});
									let data = {
										srcbids: srcbids,
										ts: new Date()
									};
									broadcast.broadcast(channelType, data);
									this.toggleShow();
									callback.call(this, this.props);
								}
							} else {
								//转单
								_this.props.transferTable.setTransformFormStatus(BUYINGREQ_CARD.leftarea, {
									status: true,
									onChange: (current, next, currentIndex) => {
										_this.props.transferTable.setTransferListValueByIndex(
											BUYINGREQ_CARD.leftarea,
											res.data,
											currentIndex
										);

										let cacheData = _this.props.transferTable.updateTransferListValueByIndex(
											BUYINGREQ_CARD.leftarea,
											res.data,
											currentIndex
										);
										_this.indexstatus[currentIndex] = 'browse';
										if (transfer) {
											rewriteTransferSrcBids(
												props,
												ATTRCODES.csourcebid,
												cacheData.body[BUYINGREQ_CARD.tableId].rows
											);
										} else if (channelType) {
											let srcbids = [];
											res.data.body[BUYINGREQ_CARD.tableId].rows.forEach((row) => {
												srcbids.push(row.values[ATTRCODES.csourcebid].value);
											});
											let data = {
												srcbids: srcbids,
												ts: new Date()
											};
											broadcast.broadcast(channelType, data);
										}
									}
								});
							}
						} else {
							props.pushTo(BUYINGREQ_CARD.cardUrl, {
								status: BUYINGREQ_CARD.browse,
								id: pk_praybill,
								pagecode: BUYINGREQ_CARD.cardpageid
							});
							this.toggleShow();
							// 提交回调
							if (callback) {
								callback.call(this, this.props);
							}
						}
					}
					showSuccessInfo(getLangByResId(_this, '4004PRAYBILL-000049')); /* 国际化处理： 保存成功！*/
				}
				this.props.updatePage(BUYINGREQ_CARD.formId, BUYINGREQ_CARD.tableId);
			}
		});
	});

	setDefData(BUYINGREQ_CARD.tempCardCacheKey, 'tempsave', false);
}
