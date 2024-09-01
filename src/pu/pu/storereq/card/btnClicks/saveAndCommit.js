/*
 * @Author: zhangchangqing
 * @PageInfo: 保存提交
 * @Date: 2018-04-19 10:35:13
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-09-28 11:00:27
 */
import { STOREREQ_CARD, ATTRCODE, STOREREQ_LIST, ATTRCODES } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import {
	addCacheData,
	updateCacheData,
	rewriteTransferSrcBids
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showSaveAndCommitInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setBtnShow } from './pageInfoClick';
import { buttonController } from '../viewControl';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';

let formId = STOREREQ_CARD.formId;
let tableId = STOREREQ_CARD.tableId;

export default function saveAndCommit(skipCodes, assign) {
	//过滤表格空行
	let _this = this;
	let props = _this.props;
	props.cardTable.filterEmptyRows(tableId, [ ATTRCODES.pk_material ], 'include');
	if (!props.cardTable.getAllRows(tableId).length) {
		showWarningInfo(null, getLangByResId(this, '4004STOREREQ-000013')); /* 国际化处理： 表体为空*/
		return;
	}
	let flag = props.validatePageToToast([
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
	let { addCacheId } = props.table;
	let data = props.createMasterChildDataSimple(STOREREQ_CARD.cardpageid, formId, tableId);
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
	//判断单据的表头pk是否存在，不存在是为新增
	let pk_storereq = data.head.card_head.rows[0].values.pk_storereq.value;
	if (pk_storereq) {
	} else {
		data.body.card_body.rows = rows;
	}
	let transfer = props.getUrlParam(STOREREQ_CARD.type);
	if (transfer) {
		data.type = STOREREQ_CARD.transfer;
	} else {
		//data.type = STOREREQ_CARD.transfer;
	}
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}

	//暂存保存
	let tempsave = getDefData(STOREREQ_CARD.tempCardCacheKey, 'tempsave');

	//暂存保存，将表头设置为新增
	if (tempsave) {
		data.head.card_head.rows[0].status = '2';
	}

	props.cardTable.selectAllRows(tableId, false);
	props.validateToSave(data, () => {
		ajax({
			url: STOREREQ_CARD.saveandcommit,
			data: data,
			success: (res) => {
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
				props.beforeUpdatePage();
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				let pk_storereq = null;

				if (res.data && res.data.isResume && res.data.isResume == true) {
					showResumeModal.bind(this)(
						props,
						'ResumeMessageDlg',
						skipCodes,
						res.data,
						saveAndCommit.bind(_this, skipCodes, assign),
						props
					);
					return;
				} else {
					if (res.success) {
						if (res.data) {
							if (res.data.head && res.data.head[formId]) {
								props.form.setAllFormValue({
									[STOREREQ_CARD.formId]: res.data.head[STOREREQ_CARD.formId]
								});
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
								// updateDtaForCompareByPk(_this.props, res.data, STOREREQ_CARD.config);
								pk_storereq = _this.props.form.getFormItemsValue(formId, ATTRCODE.pk_storereq).value;
								let vbillcode = res.data.head[formId].rows[0].values.vbillcode.value;
								_this.setState({
									lineShowType: [],
									vbillcode: vbillcode,
									billId: pk_storereq,
									billtype: res.data.head[formId].rows[0].values.vtrantypecode.value
								});

								if (status == STOREREQ_CARD.add) {
									//加入到缓存中
									// addCacheId(formId, pk_storereq);
									addCacheData(
										props,
										ATTRCODE.pk_storereq,
										pk_storereq,
										res.data,
										formId,
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
										formId,
										STOREREQ_LIST.dataSource
									);
								}
							}
							if (transfer) {
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
											cacheData.body[tableId].rows
										);
									}
								});
							} else {
								props.pushTo(STOREREQ_CARD.cardUrl, {
									status: STOREREQ_CARD.browse,
									id: pk_storereq,
									pagecode: STOREREQ_CARD.cardpageid
								});
							}
							// 设置按钮可用性
							let fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
							setBtnShow(_this, fbillstatus);
							buttonController.setBackButtonVisiable.call(_this, props);
							buttonController.lineSelected.call(_this);
							_this.skipCodes = [];
							showSaveAndCommitInfo();
						}
					}
				}
				props.updatePage(formId, tableId);
			}
		});
	});

	setDefData(STOREREQ_CARD.tempCardCacheKey, 'tempsave', false);
}
