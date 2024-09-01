/*
 * @Author: zhaochyu
 * @PageInfo:期初暂估单卡片通用查询信息
 * @Date: 2018-05-30 16:35:29
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-10-09 10:40:11
 */
import { ajax } from 'nc-lightapp-front';
import { updateCacheData, changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { LIST_BUTTON, FIELD, PAGECODE, UISTATE, URL, DATASOURCE, HEAD_FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { getCardData } from './editBtnClick';
import { buttonController } from '../viewControl';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';

export default function(props, pk) {
	let cardStatus = this.props.getUrlParam(FIELD.cardStatus);
	let copy = this.props.getUrlParam(LIST_BUTTON.Copy);
	let from = this.props.getUrlParam('from');
	if (pk == null) {
		pk = this.props.getUrlParam(FIELD.cardId);
	}
	if (cardStatus != UISTATE.add && !copy && cardStatus != UISTATE.edit && cardStatus != UISTATE.transfer) {
		let _this = this;
		if (pk) {
			_this.props.setUrlParam(pk); //动态修改地址栏中的id的值(路径中一定要是id，否则会导致切换下一条的时候，pk取不到)
		}
		cacheAndQueryData.call(this, props, pk);
	} else if (cardStatus === UISTATE.edit && from === 'list') {
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
		getCardData.call(this, pk).then((result) => {
			let bill = result.head.card_head.rows[0].values.vbillcode.value;
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: bill //修改单据号---非必传
			});
		});
		this.toggleShow();
	} else if (cardStatus === UISTATE.add && from === 'list') {
		//光标自动聚焦
		this.props.executeAutoFocus();
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
		this.props.form.setFormItemsValue(PAGECODE.cardhead, {
			[HEAD_FIELD.fbillstatus]: {
				value: '0',
				display: getLangByResId(this, '4004INITIALEST-000000') /* 国际化处理： 自由*/
			}
		});
		this.toggleShow();
	} else {
		if (copy != undefined && copy) {
			//光标自动聚焦
			this.props.executeAutoFocus();
			let data = {
				id: this.props.getUrlParam(FIELD.cardId),
				pagecode: PAGECODE.cardpagecode
			};
			if (data.id === 'undefined') {
				this.props.form.setAllFormValue(FIELD.formArea, { rows: [ {} ] });
				this.props.cardTable.setTableData(FIELD.cardTable, { rows: [] });
				return;
			}
			ajax({
				url: URL.copy,
				data: data,
				success: (res) => {
					if (data === undefined) {
						this.props.form.setAllFormValue(FIELD.formArea, { rows: [ {} ] });
						this.props.cardTable.setTableData(FIELD.cardTable, { rows: [] });
						return;
					}
					if (res.data.head) {
						this.props.form.setAllFormValue({
							[FIELD.formArea]: res.data.head[FIELD.formArea]
						});
					}
					if (res.data.body) {
						this.props.cardTable.setStatus(PAGECODE.cardbody, UISTATE.edit);
						this.props.cardTable.setTableData(FIELD.cardTable, res.data.body[FIELD.cardTable]);
					}
					this.props.BillHeadInfo.setBillHeadInfoVisible({
						showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
						showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
						billCode: '' //修改单据号---非必传
					});
					if (this.transtypeData && this.transtypeData.transtype != undefined) {
						transtypeUtils.setValue.call(
							this,
							PAGECODE.cardhead,
							HEAD_FIELD.ctrantypeid,
							HEAD_FIELD.vtrantypecode
						);
					}
					this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
					this.props.form.setFormStatus(PAGECODE.cardhead, UISTATE.edit);
					this.props.resMetaAfterPkorgEdit();
					this.props.form.setFormItemsDisabled(FIELD.formArea, {
						pk_org_v: true
					});
					this.toggleShow();
				},
				error: (err) => {
					showErrorInfo(err.message);
					buttonController.setUIState.call(this, this.props, UISTATE.browse);
					buttonController.setCardCancelButtonVisiable.call(this, this.props);
					this.props.form.EmptyAllFormValue(FIELD.formArea);
					this.props.cardTable.setTableData(FIELD.cardTable, {
						rows: []
					});
					this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
					this.props.BillHeadInfo.setBillHeadInfoVisible({
						showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
						showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
						billCode: '' //修改单据号---非必传
					});
					changeUrlParam(this.props, {
						err: true
					});
				}
			});
		}
	}
}
function cacheAndQueryData(props, pk) {
	let data = {};
	let billcode = '';
	//表示是编辑或查看进入，有id（否则就是新增进入）
	data = { id: pk, pagecode: PAGECODE.cardpagecode };
	if (!data.id || data.id === 'undefined') {
		this.props.form.EmptyAllFormValue(FIELD.formArea);
		this.props.cardTable.setTableData(FIELD.cardTable, { rows: [] });
		return;
	}
	ajax({
		url: URL.cardQuery,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.data === undefined) {
				this.props.form.EmptyAllFormValue(FIELD.formArea);
				this.props.cardTable.setTableData(FIELD.cardTable, { rows: [] });
				return;
			}
			//将查询出来的数据放到缓冲里边
			updateCacheData(props, FIELD.pk_initialest, pk, res.data, FIELD.formArea, DATASOURCE.dataSource);
			if (res.data.head) {
				this.props.form.setAllFormValue({
					[PAGECODE.cardhead]: res.data.head[PAGECODE.cardhead]
				});
				billcode = res.data.head[PAGECODE.cardhead].rows[0].values.vbillcode.value;
				this.setState({
					status: UISTATE.browse
				});
				let fbillstatus = res.data.head[PAGECODE.cardhead].rows[0].values.fbillstatus.value;
				this.toggleShow(UISTATE.browse, fbillstatus);
				this.totalnum = res.data.head[PAGECODE.cardhead].rows[0].values.ntotalastnum.value;
				this.totalprice = res.data.head[PAGECODE.cardhead].rows[0].values.ntotalorigmny.value;
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: billcode //修改单据号---非必传
				});
				showSagaErrorToasts(props, PAGECODE.cardhead, FIELD.pk_initialest);
			}
			if (res.data.body) {
				this.props.cardTable.setTableData(
					PAGECODE.cardbody,
					res.data.body[PAGECODE.cardbody],
					null,
					true,
					true
				);
			}
		},
		error: (err) => {
			showErrorInfo(err.message);
			buttonController.setUIState.call(this, this.props, UISTATE.browse);
			this.props.form.EmptyAllFormValue(FIELD.formArea);
			this.props.cardTable.setTableData(FIELD.cardTable, {
				rows: []
			});
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: '' //修改单据号---非必传
			});
			changeUrlParam(this.props, {
				err: true
			});
			buttonController.setCardBlankButtonVisiable.call(this, this.props);
		}
	});
}
