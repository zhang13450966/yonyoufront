/*
 * @Author: CongKe 
 * @PageInfo: 采购订单卡片通用查询信息
 * @Date: 2018-04-19 10:09:24 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-02-03 16:15:56
 */
import { ajax } from 'nc-lightapp-front';
import { STOREREQ_CARD, FBILLSTATUS, STOREREQ_CARD_BUTTON, STOREREQ_LIST, ATTRCODE } from '../../siconst';
import {
	getDefData,
	changeUrlParam,
	getCacheDataByPk,
	updateCacheData,
	deleteCacheData
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';
import { showSuccessInfo, showErrorInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { afterEvent } from '../afterEvents';
import { buttonController } from '../viewControl';
let formId = STOREREQ_CARD.formId; //'head';
let tableId = STOREREQ_CARD.tableId; //'body';
import getParentURlParme from './getParentURlParme';
export default function(props, pk, refresh) {
	//点击翻页清空数据
	let _this = this;
	//this.props.form.EmptyAllFormValue(formId);
	//this.props.cardTable.setTableData(tableId, { rows: [] });
	let transfer = this.props.getUrlParam(STOREREQ_CARD.type);
	if (transfer) {
		let transferIds = this.props.transferTable.getTransferTableSelectedId();
		this.getTransferValue.call(this, transferIds);
	} else {
		let param = getParentURlParme(STOREREQ_CARD.pageMsgType); //用来判断是否是从审批中心进入该页面
		let status = _this.props.getUrlParam(STOREREQ_CARD.status);
		// this.setState({
		// 	lineShowType: []
		// });
		//默认不显示按钮 收起，粘贴至此
		//this.props.button.setButtonVisible([ STOREREQ_CARD_BUTTON.CloseRow, STOREREQ_CARD_BUTTON.PasteThis ], false);
		if (!status) {
			status = STOREREQ_CARD.add;
		}
		if (status == STOREREQ_CARD.browse) {
			if (pk) {
				changeUrlParam(this.props, pk); //动态修改地址栏中的id的值(路径中一定要是id，否则会导致切换下一条的时候，pk取不到)
			}
			//非新增页面获取对应数据
			pk = this.props.getUrlParam(STOREREQ_CARD.id);
			if (pk == undefined) {
				commonShow.call(this, pk);
			} else {
				let data = { keyword: pk, pageid: this.pageId };
				if (data.keyword === 'undefined') {
					this.setState({
						vbillcode: '',
						billId: ''
					});
					return;
				}
				if (param || this.PU_STOREREQ_TYPE == 'Y') {
					buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示
				} else {
					buttonController.setCardPaginationVisible(this.props, true); //设置翻页显示
				}
				//查看缓存，如果存在缓存则不需要重新查询数据
				let cardData = getCacheDataByPk(this.props, STOREREQ_LIST.dataSource, pk);
				if (cardData && !refresh) {
					this.props.form.setAllFormValue({ [formId]: cardData.head[formId] });
					cardData.body[tableId].rows.map((item, index) => {
						let sta = item.status;
						if (sta == 3) {
							item.status = '0';
						}
					});
					this.props.cardTable.setTableData(tableId, cardData.body[tableId], null, true, true);
					//设置按钮显示
					let fbillstatus = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.fbillstatus);
					let vbillcode = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.vbillcode);
					let billId = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_storereq);
					//跳转卡片弹出提示框
					showSagaErrorToasts(this.props, formId, ATTRCODE.pk_praybill);
					//如果取缓存数据，需要将控制行按钮显示的数组重置
					this.setState(
						{
							lineShowType: [],
							vbillcode: vbillcode.value,
							billId: billId.value
						},
						() => {
							setBtnShow(_this, fbillstatus.value);
							buttonController.setBackButtonVisiable.call(this, this.props, param);
							buttonController.lineSelected.call(this);
						}
					);
				} else {
					ajax({
						url: STOREREQ_CARD.queryCardInfoURL,
						data: data,
						success: (res) => {
							if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
								props.dealFormulamsg(res.formulamsg);
							}
							if (data === undefined) {
								//订单编号
								this.setState({
									vbillcode: '',
									billId: ''
								});
								return;
							}
							if (res.data) {
								//渲染数据前先清空值，
								// this.props.form.EmptyAllFormValue(formId);
								// this.props.cardTable.setTableData(tableId, { rows: [] });
								if (res.data.head) {
									this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
									_this.setState({
										lineShowType: [],
										vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
										billId: res.data.head[formId].rows[0].values.pk_storereq.value,
										billtype: res.data.head[formId].rows[0].values.vtrantypecode.value
									});
									let fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
									// 设置按钮可用性
									//this.isActionEnable();
									if (param) {
										this.toggleShow();
									} else {
										setBtnShow(_this, fbillstatus);
										buttonController.setBackButtonVisiable.call(this, this.props, param);
										buttonController.lineSelected.call(this);
									}
								}

								let pkid = res.data.head[formId].rows[0].values.pk_storereq.value;
								updateCacheData(
									_this.props,
									ATTRCODE.pk_storereq,
									pkid,
									res.data,
									formId,
									STOREREQ_LIST.dataSource
								);
								if (res.data.body) {
									this.props.cardTable.setTableData(
										tableId,
										res.data.body[tableId],
										null,
										true,
										true
									);
								}
								buttonController.setUIState.call(this, this.props, STOREREQ_CARD.browse);
								//跳转卡片弹出提示框
								showSagaErrorToasts(this.props, STOREREQ_CARD.formId, ATTRCODE.pk_storereq);
								//this.toggleShow();
								if (refresh) {
									showSuccessInfo(getLangByResId(this, '4004STOREREQ-000040') /* 国际化处理： 刷新成功！*/);
								}
							} else {
								if (refresh) {
									showErrorInfo(getLangByResId(this, '4004STOREREQ-000052')); /* 国际化处理： 刷新失败！*/
								}
							}
						},
						error: (res) => {
							showErrorInfo(res.message);
							commonShow.call(this, pk);
						}
					});
				}
			}
		} else if (status == STOREREQ_CARD.edit) {
			let data = { keyword: this.props.getUrlParam(STOREREQ_CARD.id), pageid: this.pageId };
			ajax({
				url: STOREREQ_CARD.editCardInfoURL,
				data: data,
				success: (res) => {
					buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						this.props.dealFormulamsg(res.formulamsg);
					}
					if (data === undefined) {
						//订单编号
						this.setState({
							vbillcode: '',
							billId: ''
						});
						return;
					}
					if (res.data.head) {
						this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
						this.setState({
							vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
							billId: res.data.head[formId].rows[0].values.pk_storereq.value
						});
						// 设置按钮可用性
						//this.isActionEnable();
					}
					if (res.data.body) {
						this.props.cardTable.setTableData(tableId, res.data.body[tableId]);
					}
					//修改组织的可编辑状态
					this.props.form.setFormItemsDisabled(STOREREQ_CARD.formId, { [STOREREQ_CARD.pk_org_v]: true });
					this.toggleShow();
				}
			});
		} else {
			//新增，分为复制新增和自制
			let copy = this.props.getUrlParam(STOREREQ_CARD.copy);
			let comeType = this.props.getUrlParam(STOREREQ_CARD.comeType); //判断是否是从浏览页面点击按钮的新增
			if (copy != undefined && copy) {
				//从列表页复制的单据处理
				let data = { keyword: this.props.getUrlParam(STOREREQ_CARD.id), pageid: this.pageId };
				//订单编号
				this.setState({
					copy_billId: this.props.getUrlParam(STOREREQ_CARD.id),
					vbillcode: '',
					billId: ''
				});
				if (data.keyword === 'undefined') {
					this.props.form.EmptyAllFormValue(formId);
					this.props.cardTable.setTableData(tableId, { rows: [] });
					return;
				}
				ajax({
					url: STOREREQ_CARD.copyCardInfoURL,
					data: data,
					success: (res) => {
						if (data === undefined) {
							//订单编号
							this.setState({
								vbillcode: '',
								billId: ''
							});
							return;
						}
						if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
							this.props.dealFormulamsg(res.formulamsg);
						}
						if (res.data.head) {
							this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(tableId, res.data.body[tableId]);
						}
						buttonController.setUIState.call(this, this.props, STOREREQ_CARD.edit);
						//修改组织的可编辑状态 不可编辑
						this.props.resMetaAfterPkorgEdit();
						this.props.form.setFormItemsDisabled(STOREREQ_CARD.formId, { [STOREREQ_CARD.pk_org_v]: true });
						this.toggleShow();
						//修改组织的可编辑状态
					},
					error: (res) => {
						showErrorInfo(res.message);
						commonShow.call(this, pk);
						this.props.resMetaAfterPkorgEdit(); //恢复主组织编辑性
					}
				});
			} else if (comeType != undefined && comeType) {
				//从浏览态点击新增，清空数据
				this.props.form.EmptyAllFormValue(formId);
				//订单编号
				this.setState({
					vbillcode: '',
					billId: ''
				});
				buttonController.setUIState.call(this, this.props, STOREREQ_CARD.edit);
				let pk_org_v = getDefData(STOREREQ_LIST.dataSource, ATTRCODE.pk_org_v);
				let org_v_Name = getDefData(STOREREQ_LIST.dataSource, 'pk_org_name');
				if (pk_org_v) {
					afterEvent.call(
						this,
						this.props,
						STOREREQ_CARD.formId,
						ATTRCODE.pk_org_v,
						{ value: pk_org_v, display: org_v_Name },
						null,
						{
							refpk: pk_org_v,
							refname: org_v_Name
						}
					);
					this.props.form.setFormItemsDisabled(STOREREQ_CARD.formId, { pk_org_v: false });
				} else {
					//订单编号
					this.setState({
						copy_billId: this.props.getUrlParam(STOREREQ_CARD.id)
					});
					this.props.cardTable.setTableData(tableId, { rows: [] });
					//获取表体行数量
					let rows = this.props.cardTable.getNumberOfRows(STOREREQ_CARD.tableId);
					//删除表体行数
					for (let ii = 0; ii < rows; ii++) {
						this.props.cardTable.delRowsByIndex(STOREREQ_CARD.tableId, 0);
					}
					this.props.form.setFormItemsValue(STOREREQ_CARD.formId, {
						[ATTRCODE.pk_org_v]: { value: null, display: null }
					});
				}
				//修改组织的可编辑状态
				this.props.form.setFormItemsDisabled(STOREREQ_CARD.formId, { [STOREREQ_CARD.pk_org_v]: false });
				this.props.initMetaByPkorg(STOREREQ_CARD.pk_org_v);
				this.toggleShow();
				//this.forceUpdate();
			} else {
				//修改组织的可编辑状态
				this.props.form.setFormItemsDisabled(STOREREQ_CARD.formId, { [STOREREQ_CARD.pk_org_v]: false });
				this.toggleShow();
			}
		}
	}
}
function setBtnShow(_this, fbillstatus) {
	buttonController.setUIState.call(_this, _this.props, STOREREQ_CARD.browse);
	if (_this.PU_STOREREQ_TYPE == 'N') {
		buttonController.setCardPaginationVisible(_this.props, true); //设置翻页不显示
	}
	buttonController.setBrowseButtonByStatus.call(_this, _this.props, fbillstatus);
	let type = _this.props.getUrlParam(STOREREQ_CARD.type);
	if (type) {
		_this.props.button.setButtonVisible([ STOREREQ_CARD_BUTTON.Group31, STOREREQ_CARD_BUTTON.Copy ], false);
	}
}
//空白页面控制使用   状态为浏览态  只显示返回按钮，新增按钮
function commonShow(pk) {
	this.setState({
		vbillcode: '',
		copy_billId: ''
	});
	let showBackBtn = true;
	if (this.PU_STOREREQ_TYPE == 'Y') {
		showBackBtn = false;
	}
	this.props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: showBackBtn, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
		showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
		billCode: this.state.vbillcode //修改单据号---非必传
	});
	buttonController.lineSelected.call(this);
	buttonController.setUIState.call(this, this.props, STOREREQ_CARD.browse);
	this.props.form.EmptyAllFormValue(formId);
	this.props.cardTable.setTableData(tableId, { rows: [] });
	buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示

	buttonController.setBlankPageButtons.call(this);
	//deleteCacheData(this.props, 'pk_storereq', pk, STOREREQ_LIST.dataSource);
}
export { setBtnShow };
