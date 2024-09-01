/*
 * @Author: zhaochyu
 * @PageInfo: 取消操作
 * @Date: 2018-05-03 10:55:18
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:18:32
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, FIELD, UISTATE, DATASOURCE, PAGECODE, AREA, LIST_BUTTON, HEAD_FIELD } from '../../constance';
import { getCurrentLastId, getCacheDataByPk, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import cancelCopyLine from './cancelCopyLine';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';
import { buttonController } from '../viewControl';
export default function(props, currentindex) {
	// 执行取消操作提示
	showWarningDialog(getLangByResId(this, '4004INITIALEST-000040'), getLangByResId(this, '4004INITIALEST-000005'), {
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: CancelFunction.bind(this, {
			props: props,
			currentindex: currentindex
		})
	});
}
function CancelFunction(params) {
	cancelCopyLine.call(this, this.props);
	let status = this.props.getUrlParam(FIELD.cardStatus);
	if (status != UISTATE.transfer) {
		this.props.resMetaAfterPkorgEdit();
	}
	this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true); //设置翻页显示
	let pk_initialest = this.props.getUrlParam(FIELD.cardId);
	this.indexstatus[this.curindex] = UISTATE.browse;
	let billcode = '';
	let { props, currentindex } = params;
	let from = this.props.getUrlParam('from');
	let err = this.props.getUrlParam('err');
	let update = this.props.getUrlParam('update');
	if (from == 'list' || err == true) {
		let pk = null;
		if (update === 'update') {
			pk = pk_initialest;
		} else {
			pk = getCurrentLastId(DATASOURCE.dataSource);
		}
		if (pk != null) {
			//获取缓冲中的数据
			let cardData = getCacheDataByPk(props, DATASOURCE.dataSource, pk);
			if (cardData) {
				this.props.form.setAllFormValue({
					[FIELD.formArea]: cardData.head[FIELD.formArea]
				});
				this.props.cardTable.setTableData(FIELD.cardTable, cardData.body[FIELD.cardTable]);
				let billstatus = cardData.head.card_head.rows[0].values.fbillstatus.value;
				this.props.pushTo(URL.cardurl, {
					status: UISTATE.browse,
					id: pk,
					billStatus: billstatus,
					pagecode: PAGECODE.cardpagecode
				});
				billcode = cardData.head.card_head.rows[0].values.vbillcode.value;
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: billcode //修改单据号---非必传
				});
				this.toggleShow(UISTATE.browse, billstatus);
				showSagaErrorToasts(this.props, PAGECODE.cardhead, FIELD.pk_initialest);
			} else {
				getCardData.call(this, this.props, pk, false);
			}
			props.form.setFormStatus(AREA.cardFormArea, UISTATE.browse);
			props.cardTable.setStatus(AREA.cardTableArea, UISTATE.browse);
			return;
		} else {
			props.form.EmptyAllFormValue(AREA.cardFormArea);
			props.cardTable.setTableData(AREA.cardTableArea, { rows: [] });
			buttonController.setCardCancelButtonVisiable.call(this, this.props);
			buttonController.setUIState.call(this, props, UISTATE.browse);
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			});
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
			return;
		}
	}
	if (status == UISTATE.transfer) {
		if (props.transferTable.getTransformFormCompleteStatus(AREA.leftarea, parseInt(currentindex)) == true) {
			this.props.form.cancel(PAGECODE.cardhead);
			this.props.cardTable.resetTableData(PAGECODE.cardbody);
			buttonController.setCardTransferButtonVisiable.call(this, UISTATE.browse);
			this.indexstatus[this.curindex] = UISTATE.browse;
			let pkk = this.props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_initialest);
			getCardData.call(this, this.props, pkk.value, true);
		} else {
			if (props.transferTable.getTransformFormAmount(AREA.leftarea) == 1) {
				//history.go(-1);
				let map = new Map();
				map.set(FIELD.transfer, URL.gotoTransfer);

				let _url = map.get(UISTATE.transfer);
				this.props.pushTo(_url, { pagecode: PAGECODE.cardpagecode });
			} else {
				this.indexstatus = {};
				props.transferTable.setTransformFormStatus(AREA.leftarea, {
					status: false,
					onChange: (current, next) => {
						toast({
							color: 'info',
							content: getLangByResId(this, '4004INITIALEST-000006')
						}); /* 国际化处理： 取消成功*/
					}
				});
			}
		}
	} else if (status == UISTATE.add) {
		//cancelCopyLine.call(this, this.props);
		if (pk_initialest && 'null' !== pk_initialest) {
			//获取缓冲中的数据
			let cardData = getCacheDataByPk(props, DATASOURCE.dataSource, pk_initialest);
			if (cardData) {
				this.props.form.setAllFormValue({
					[FIELD.formArea]: cardData.head[FIELD.formArea]
				});
				this.props.cardTable.setTableData(FIELD.cardTable, cardData.body[FIELD.cardTable]);
				let billstatus = cardData.head.card_head.rows[0].values.fbillstatus.value;
				this.props.pushTo(URL.cardurl, {
					status: UISTATE.browse,
					id: pk_initialest,
					billStatus: billstatus,
					pagecode: PAGECODE.cardpagecode
				});
				billcode = cardData.head.card_head.rows[0].values.vbillcode.value;
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: billcode //修改单据号---非必传
				});
			}
			this.toggleShow();
			showSagaErrorToasts(this.props, PAGECODE.cardhead, FIELD.pk_initialest);
		} else {
			props.form.EmptyAllFormValue(AREA.cardFormArea);
			props.cardTable.setTableData(AREA.cardTableArea, { rows: [] });
			buttonController.setCardCancelButtonVisiable.call(this, this.props);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: '' //修改单据号---非必传
			});
		}
		//恢复编辑性
		props.resMetaAfterPkorgEdit(FIELD.pk_org_v);
		//每个判断都要走的方法
		buttonController.setUIState.call(this, this.props, UISTATE.browse);
	} else {
		let currentpk = null;
		let billStatus = this.props.getUrlParam(FIELD.fbillstatus);
		let id = getCurrentLastId(DATASOURCE.dataSource);
		let copy = this.props.getUrlParam(LIST_BUTTON.Copy);
		if (pk_initialest != null && !copy) {
			currentpk = pk_initialest;
			getCardData.call(this, this.props, currentpk, false);
		} else if (copy) {
			currentpk = pk_initialest;
		} else {
			currentpk = id;
		}
		this.props.pushTo(URL.cardurl, {
			status: UISTATE.browse,
			billStatus: billStatus,
			id: currentpk,
			pagecode: PAGECODE.cardpagecode
		});
		this.toggleShow();
		this.props.setUrlParam(currentpk);
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true
		});
		if ((id == null || id == '' || pk_initialest != null) && !copy) return;
		//判断是否是复制过来的数据
		let dData = getCacheDataByPk(props, DATASOURCE.dataSource, currentpk);
		if (dData) {
			this.props.form.setAllFormValue({
				[FIELD.formArea]: dData.head[FIELD.formArea]
			});
			this.props.cardTable.setTableData(FIELD.cardTable, dData.body[FIELD.cardTable]);
			let code = dData.head.card_head.rows[0].values.vbillcode.value;
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: code //修改单据号---非必传
			});
			showSagaErrorToasts(this.props, PAGECODE.cardhead, FIELD.pk_initialest);
		} else {
			getCardData.call(this, this.props, currentpk, false);
		}
	}
}
function getCardData(props, pk, flag) {
	let data = { id: pk, pagecode: PAGECODE.cardpagecode };
	ajax({
		url: URL.cardQuery,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.data === undefined) {
				this.props.form.setAllFormValue(FIELD.formArea, { rows: [ {} ] });
				this.props.cardTable.setTableData(FIELD.cardTable, { rows: [] });
				return;
			}
			//将查询出来的数据放到缓冲里边
			updateCacheData(props, FIELD.pk_initialest, pk, res.data, FIELD.formArea, DATASOURCE.dataSource);
			if (res.data.head) {
				this.props.form.setAllFormValue({
					[PAGECODE.cardhead]: res.data.head[PAGECODE.cardhead]
				});
			}
			if (res.data.body) {
				this.props.cardTable.setTableData(PAGECODE.cardbody, res.data.body[PAGECODE.cardbody]);
			}
			if (!flag) {
				let billstatus = res.data.head.card_head.rows[0].values.fbillstatus.value;
				let bill_code = res.data.head.card_head.rows[0].values.vbillcode.value;
				this.props.pushTo(URL.cardurl, {
					status: UISTATE.browse,
					id: pk,
					billStatus: billstatus,
					pagecode: PAGECODE.cardpagecode
				});
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true,
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: bill_code //修改单据号---非必传
				});
				this.toggleShow(UISTATE.browse, billstatus);
			}
			if (flag) {
				cachedata.call(this, PAGECODE.cardhead);
				cachedata.call(this, PAGECODE.cardbody);
			}
			showSagaErrorToasts(this.props, PAGECODE.cardhead, FIELD.pk_initialest);
			this.props.setUrlParam(pk);
		}
	});
}
function cachedata(moduleId) {
	// 转单标识
	let transfer = this.props.getUrlParam(FIELD.cardStatus) === FIELD.transfer;
	if (transfer) {
		let { currentindex, listdata } = this.state;
		let curindex = this.curindex;
		const { transferTable, form } = this.props;
		const { setTransferListValueByIndex } = transferTable;
		if (moduleId == PAGECODE.cardhead && listdata != '') {
			// 转单表头数据做缓存
			let headVals = form.getAllFormValue(moduleId);
			listdata[curindex].head[PAGECODE.cardhead].rows = headVals.rows;
			setTransferListValueByIndex(AREA.leftarea, listdata[curindex], curindex);
		} else if (moduleId == PAGECODE.cardbody && listdata != '') {
			// 表格数据
			let bodyVals = this.props.cardTable.getAllData(moduleId);
			listdata[curindex].body[PAGECODE.cardbody].rows = bodyVals.rows;
			setTransferListValueByIndex(AREA.leftarea, listdata[curindex], curindex);
		}
	}
}
