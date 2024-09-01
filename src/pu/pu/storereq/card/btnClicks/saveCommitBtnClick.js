/*
 * @Author: zhangchangqing 
 * @PageInfo: 保存按钮事件
 * @Date: 2018-04-19 10:35:13 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-13 14:29:36
 */
import saveBtn from './saveBtnClick';
import commitBtnClick from './commitBtnClick';
export default function saveCommitBtnClick(props, skipCodes) {
	saveBtn.call(this, props, skipCodes, commitBtnClick);
	// //过滤表格空行
	//
	// let _this = this;
	// let formerror = this.props.form.isCheckNow(STOREREQ_CARD.formId); //表单必输校验
	// if (!formerror) {
	// 	return;
	// }
	// props.cardTable.filterEmptyRows(STOREREQ_CARD.tableId, [ ATTRCODES.pk_material ], 'include');
	// if (!props.cardTable.getAllRows(STOREREQ_CARD.tableId).length) {
	// 	showWarningInfo(null, getLangByResId(this, '4004STOREREQ-000013')); /* 国际化处理： 表体为空*/
	// 	return;
	// }
	// let tableerror = this.props.cardTable.checkTableRequired(STOREREQ_CARD.tableId); //表格必输项校验
	// if (!tableerror) {
	// 	return;
	// }
	// let { addCacheId } = this.props.table;
	// let data = props.createMasterChildDataSimple(STOREREQ_CARD.cardpageid, STOREREQ_CARD.formId, STOREREQ_CARD.tableId);
	// data.pageid = STOREREQ_CARD.cardpageid;
	// data.templetid = this.state.templetid;
	// skipCodes = skipCodes ? skipCodes : new Array();
	// data['skipCodes'] = skipCodes;
	// let status = props.getUrlParam(STOREREQ_CARD.status);
	// let rows = [];
	// data.body.card_body.rows.map((item, index) => {
	// 	item.values.pseudocolumn.value = index + '';
	// 	let sta = item.status;
	// 	if (sta == 2) {
	// 		item.values.pk_storereq.value = null;
	// 		item.values.pk_storereq_b.value = null;
	// 	}
	// 	if (sta != 3) {
	// 		rows.push(item);
	// 	}
	// });
	// //判断单据的表头pk是否存在，不存在是为新增
	// let pk_storereq = data.head.card_head.rows[0].values.pk_storereq.value;
	// if (!pk_storereq) {
	// 	data.body.card_body.rows = rows;
	// }
	// //data.body[STOREREQ_CARD.tableId] = simplifyData(data.body[STOREREQ_CARD.tableId]);
	// this.props.cardTable.selectAllRows(STOREREQ_CARD.tableId, false);
	// this.props.validateToSave(data, () => {
	// 	ajax({
	// 		url: STOREREQ_CARD.saveCommitURL,
	// 		data: data,
	// 		success: (res) => {
	// 			this.props.beforeUpdatePage();
	// 			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
	// 				props.dealFormulamsg(res.formulamsg);
	// 			}
	// 			let pk_storereq = null;
	//
	// 			if (res.data.isResume && res.data.isResume == true) {
	// 				showResumeModal.bind(this)(props, 'ResumeMessageDlg', skipCodes, res.data, clickSaveBtn, props);
	// 				return;
	// 			} else {
	// 				if (res.success) {
	// 					if (res.data) {
	// 						if (res.data.body && res.data.body[STOREREQ_CARD.tableId]) {
	// 							let fullTableData = props.cardTable.updateDataByRowId(
	// 								STOREREQ_CARD.tableId,
	// 								res.data.body[STOREREQ_CARD.tableId],
	// 								true
	// 							);
	// 							res.data.body[STOREREQ_CARD.tableId] = fullTableData;
	// 						}
	// 						if (res.data.head && res.data.head[STOREREQ_CARD.formId]) {
	//
	// 							props.form.setAllFormValue({
	// 								[STOREREQ_CARD.formId]: res.data.head[STOREREQ_CARD.formId]
	// 							});
	// 							pk_storereq = res.data.head[STOREREQ_CARD.formId].rows[0].values.pk_storereq.value;
	// 							let vbillcode = res.data.head[STOREREQ_CARD.formId].rows[0].values.vbillcode.value;
	// 							if (status == STOREREQ_CARD.add) {
	// 								//订单编号
	// 								_this.setState({
	// 									vbillcode: vbillcode,
	// 									billId: pk_storereq
	// 								});
	// 								//加入到缓存中
	// 								addCacheId(STOREREQ_CARD.formId, pk_storereq);
	// 								addCacheData(
	// 									props,
	// 									ATTRCODE.pk_storereq,
	// 									pk_storereq,
	// 									res.data,
	// 									STOREREQ_CARD.formId,
	// 									STOREREQ_LIST.dataSource
	// 								);
	// 								// 更新翻页组件当前pk值
	// 								props.cardPagination.setCardPaginationId({
	// 									id: pk_storereq,
	// 									status: 1
	// 								});
	// 							} else if (status == STOREREQ_CARD.edit) {
	// 								updateCacheData(
	// 									props,
	// 									ATTRCODE.pk_storereq,
	// 									pk_storereq,
	// 									res.data,
	// 									STOREREQ_CARD.formId,
	// 									STOREREQ_LIST.dataSource
	// 								);
	// 							}
	// 							props.pushTo(STOREREQ_CARD.cardUrl, {
	// 								status: STOREREQ_CARD.browse,
	// 								id: pk_storereq
	// 							});
	// 						}

	// 						//this.toggleShow();
	// 						let fbillstatus = res.data.head[STOREREQ_CARD.formId].rows[0].values.fbillstatus.value;
	// 						setBtnShow(_this, fbillstatus);
	// 						let param = getParentURlParme(STOREREQ_CARD.pageMsgType); //用来判断是否是从审批中心进入该页面
	// 						buttonController.setBackButtonVisiable.call(this, this.props, param);
	// 					}
	// 					showSuccessInfo(getLangByResId(this, '4004STOREREQ-000039')); /* 国际化处理： 保存成功！*/
	// 					showSuccessInfo(getLangByResId(this, '4004STOREREQ-000020')); /* 国际化处理： 提交成功！*/
	// 					//showSuccessInfo(getLangByResId(this, '4004STOREREQ-000048') /* 国际化处理： 保存提交成功！*/);
	// 				}
	// 			}
	// 			this.props.updatePage(STOREREQ_CARD.formId, STOREREQ_CARD.tableId);
	// 		}
	// 	});
	// });
}
