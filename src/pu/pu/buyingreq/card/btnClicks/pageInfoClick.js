/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-06-26 15:36:13 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-11-04 11:41:14
 */

import { ajax, cacheTools, cardCache } from 'nc-lightapp-front';
import { BUYINGREQ_CARD, BUYINGREQ_LIST, FBILLSTATUS, BUYINGREQ_CARD_BUTTON, ATTRCODES, ATTRCODE } from '../../siconst';
import getParentURlParme from './getParentURlParme';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import {
	changeUrlParam,
	getCacheDataByPk,
	updateCacheData,
	getDefData,
	deleteCacheData
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import {
	showWarningDialog,
	showSuccessInfo,
	showErrorInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { afterEvent } from '../afterEvents';
import { buttonController } from '../viewControl';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';
let formId = BUYINGREQ_CARD.formId; //'head';
let tableId = BUYINGREQ_CARD.tableId; //'body';
export default function(props, pk, refresh) {
	//根据地址中的 type判断是否是拉单的操作

	let _this = this;
	//推单标识
	let channelType = _this.props.getUrlParam(BUYINGREQ_CARD.channelType);
	let transfer = this.props.getUrlParam(BUYINGREQ_CARD.type);
	if (channelType) {
		arrange(_this, channelType);
	} else if (transfer) {
		let transferIds = this.props.transferTable.getTransferTableSelectedId();
		this.getTransferValue.call(this, transferIds);
	} else {
		//点击翻页清空数据
		//this.props.form.EmptyAllFormValue(formId);
		//this.props.cardTable.setTableData(tableId, { rows: [] });
		//this.props.getUrlParam(BUYINGREQ_CARD.status);

		//获取从父页面中的URL获取参数，控制页面按钮的显示（能取到值说明是审批中心连接过来的，没有就是正常的卡片页面的按钮）
		let parentURL = getParentURlParme(BUYINGREQ_CARD.pageMsgType);
		if (this.props.getUrlParam('status') == BUYINGREQ_CARD.browse) {
			let type = this.props.getUrlParam(BUYINGREQ_CARD.type);
			//如果是拉单或者推单页面进入 ，则显示退出转单按钮
			if (type === BUYINGREQ_CARD.transfer || channelType) {
				this.props.button.setButtonVisible([ BUYINGREQ_CARD_BUTTON.CancelTransfer ], true);
			} else {
				this.props.button.setButtonVisible([ BUYINGREQ_CARD_BUTTON.CancelTransfer ], false);
			}
			let _this = this;
			if (pk) {
				changeUrlParam(this.props, pk); //动态修改地址栏中的id的值(路径中一定要是id，否则会导致切换下一条的时候，pk取不到)
			}
			//非新增页面获取对应数据
			pk = this.props.getUrlParam(BUYINGREQ_CARD.id);
			//如果没有pk,清空数据，只显示新增按钮
			if (pk == undefined) {
				// this.setState(
				// 	{
				// 		vbillcode: ''
				// 	},
				// 	() => {
				// 		//this.setBillHead(this);
				// 		buttonController.setBackButtonVisiable.call(this, this.props, parentURL);
				// 		buttonController.lineSelected.call(this);
				// 	}
				// );
				// buttonController.setUIState.call(this, this.props, BUYINGREQ_CARD.browse);
				// //设置空白页面的按钮
				// buttonController.setBlankPageButtons.call(this);
				// this.props.form.EmptyAllFormValue(formId);
				// this.props.cardTable.setTableData(tableId, { rows: [] });
				// buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示
				commonShow.call(this, pk);
			} else {
				let data = { keyword: pk, pageid: this.pageId };
				if (data.keyword === 'undefined') {
					this.setState({
						vbillcode: ''
					});
					return;
				}
				if (parentURL) {
					//如果是从审批进入，不显示翻页
					buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示
				} else {
					buttonController.setCardPaginationVisible(this.props, true); //设置翻页显示
				}
				//查看缓存，如果存在缓存则不需要重新查询数据
				//let cardData = getCacheById(pk, BUYINGREQ_LIST.dataSource);
				let cardData = getCacheDataByPk(this.props, BUYINGREQ_LIST.dataSource, pk);
				if (cardData && !refresh) {
					this.props.form.setAllFormValue({ [formId]: cardData.head[formId] });
					this.props.cardTable.setTableData(tableId, cardData.body[tableId], null, true, true);
					//设置按钮显示
					let fbillstatus = this.props.form.getFormItemsValue(formId, ATTRCODE.fbillstatus);
					let vbillcode = this.props.form.getFormItemsValue(formId, ATTRCODE.vbillcode);
					let billId = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_praybill);
					//如果取缓存数据，需要将控制行按钮显示的数组重置
					this.setState(
						{
							lineShowType: [],
							vbillcode: vbillcode.value,
							billId: billId.value
						},
						() => {
							//this.setBillHead(this);
							buttonController.setBackButtonVisiable.call(this, this.props, parentURL);
							buttonController.lineSelected.call(this);
						}
					);
					//跳转卡片弹出提示框
					showSagaErrorToasts(this.props, formId, ATTRCODE.pk_praybill);
					setBtnShow(_this, fbillstatus.value);
				} else {
					ajax({
						url: BUYINGREQ_CARD.queryCardInfoURL,
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
								if (res.data.head) {
									this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
									let pk = res.data.head[formId].rows[0].values.pk_praybill.value;
									let pkSrc = res.data.head[formId].rows[0].values.pk_srcpraybill.value;
									if (pkSrc) {
										pk = pkSrc;
									}
									this.setState(
										{
											lineShowType: [],
											vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
											billId: pk,
											billtype: res.data.head[formId].rows[0].values.vtrantypecode.value
										},
										() => {
											//this.setBillHead(this);
											buttonController.setBackButtonVisiable.call(this, this.props, parentURL);
											// 刷新控制按钮可用，先取消表体选择
											this.props.cardTable.selectAllRows(tableId, false);
											buttonController.lineSelected.call(this);
										}
									);
									let fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
									// 设置按钮可用性
									//this.isActionEnable();
									if (parentURL) {
										this.toggleShow();
									} else {
										//设置按钮显示
										setBtnShow(_this, fbillstatus);
									}
								}
								let pkid = res.data.head[formId].rows[0].values.pk_praybill.value;
								//updateCache('P' + pkid, pkid, res.data, formId, BUYINGREQ_LIST.dataSource);
								updateCacheData(
									this.props,
									ATTRCODE.pk_praybill,
									pkid,
									res.data,
									formId,
									BUYINGREQ_LIST.dataSource
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
								buttonController.setUIState.call(this, this.props, BUYINGREQ_CARD.browse);
								//this.toggleShow();
								//跳转卡片弹出提示框
								showSagaErrorToasts(this.props, formId, ATTRCODE.pk_praybill);
								if (refresh) {
									showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000051')); /* 国际化处理： 刷新成功！*/
								}
							} else {
								if (refresh) {
									showErrorInfo(getLangByResId(this, '4004PRAYBILL-000062')); /* 国际化处理： 刷新失败！*/
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
		} else if (this.props.getUrlParam(BUYINGREQ_CARD.status) == BUYINGREQ_CARD.edit) {
			let data = { keyword: this.props.getUrlParam(BUYINGREQ_CARD.id), pageid: this.pageId };
			ajax({
				url: BUYINGREQ_CARD.editCardInfoURL,
				data: data,
				success: (res) => {
					buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示

					if (data === undefined) {
						//订单编号
						this.setState({
							vbillcode: '',
							billId: ''
						});
						return;
					}
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
							this.setState({
								vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
								billId: res.data.head[formId].rows[0].values.pk_praybill.value
							});
							// 设置按钮可用性
							//this.isActionEnable();
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(tableId, res.data.body[tableId]);
						}
						//修改组织的可编辑状态
						this.props.form.setFormItemsDisabled(formId, {
							[BUYINGREQ_CARD.pk_org_v]: true
						});
						this.toggleShow();
					}
				}
			});
		} else {
			//新增，分为复制新增和自制

			let copy = this.props.getUrlParam(BUYINGREQ_CARD.copy);
			let comeType = this.props.getUrlParam(BUYINGREQ_CARD.comeType); //判断是否是从浏览页面点击按钮的新增

			if (copy != undefined && copy) {
				//从列表页复制的单据处理
				let data = { keyword: this.props.getUrlParam(BUYINGREQ_CARD.id), pageid: this.pageId };
				//订单编号
				this.setState({
					copy_billId: this.props.getUrlParam(BUYINGREQ_CARD.id),
					vbillcode: '',
					billId: ''
				});
				if (data.keyword === 'undefined') {
					this.props.form.EmptyAllFormValue(formId);
					this.props.cardTable.setTableData(tableId, { rows: [] });
					return;
				}
				ajax({
					url: BUYINGREQ_CARD.copyCardInfoURL,
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
							if (res.data.head) {
								this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(tableId, res.data.body[tableId]);
							}
							//修改组织的可编辑状态
							this.props.resMetaAfterPkorgEdit();
							this.props.form.setFormItemsDisabled(formId, {
								[BUYINGREQ_CARD.pk_org_v]: true
							});
							this.toggleShow();
						}
					},
					error: (res) => {
						showErrorInfo(res.message);
						commonShow.call(this, pk);
						this.props.resMetaAfterPkorgEdit(); //恢复主组织编辑性
					}
				});
			} else if (comeType != undefined && comeType) {
				//丛浏览态点击新增，清空数据
				this.props.form.EmptyAllFormValue(formId);
				//订单编号
				this.setState({
					vbillcode: '',
					billId: ''
				});
				this.props.cardTable.setStatus(tableId, BUYINGREQ_CARD.edit);
				this.props.form.setFormStatus(formId, BUYINGREQ_CARD.edit);
				let pk_org_v = getDefData(BUYINGREQ_LIST.dataSource, ATTRCODE.pk_org_v);
				let org_v_Name = getDefData(BUYINGREQ_LIST.dataSource, 'pk_org_name');
				if (pk_org_v && org_v_Name) {
					afterEvent.call(
						this,
						this.props,
						formId,
						ATTRCODE.pk_org_v,
						{ value: pk_org_v, display: org_v_Name },
						null,
						{
							refpk: pk_org_v,
							refname: org_v_Name
						}
					);
					this.props.form.setFormItemsDisabled(formId, { pk_org_v: false });
				} else {
					this.setState({
						copy_billId: this.props.getUrlParam(BUYINGREQ_CARD.id)
					});
					this.props.cardTable.setTableData(tableId, { rows: [] });
					this.props.form.setFormItemsValue(formId, {
						[ATTRCODE.pk_org_v]: { value: null, display: null }
					});
				}
				//设置委外和直运的默认为false，狗日的平台模板的默认值偶尔不生效导致报错
				this.props.form.setFormItemsValue(formId, {
					[ATTRCODE.bsctype]: { value: false, display: null }
				});
				this.props.form.setFormItemsValue(formId, {
					[ATTRCODE.bdirecttransit]: { value: false, display: null }
				});
				//修改组织的可编辑状态
				this.props.form.setFormItemsDisabled(formId, { [BUYINGREQ_CARD.pk_org_v]: false });
				this.props.initMetaByPkorg(BUYINGREQ_CARD.pk_org_v);
				this.toggleShow();
			} else {
				//修改组织的可编辑状态
				this.props.form.setFormItemsDisabled(formId, { [BUYINGREQ_CARD.pk_org_v]: false });
				//设置委外和直运的默认为false，狗日的平台模板的默认值偶尔不生效导致报错
				this.props.form.setFormItemsValue(formId, {
					[ATTRCODE.bsctype]: { value: false, display: null }
				});
				this.props.form.setFormItemsValue(formId, {
					[ATTRCODE.bdirecttransit]: { value: false, display: null }
				});
				//自制新增
				this.toggleShow();
			}
		}
	}
}
function arrange(_this, channelType) {
	let ids;

	let appcode = _this.props.getSearchParam('c'); //当前应用的编码 返回时使用，直接返回列表页
	let orgid = _this.props.getUrlParam('orgid'); //主组织id
	let vsrctype = _this.props.getUrlParam('vsrctype'); //上游单据类型，用来判断调用哪个接口
	let url = _this.props.getUrlParam('channelAddress');
	if (channelType == BUYINGREQ_CARD.replenishmentarrange) {
		//ids = cacheTools.get('replenishmentArrangeIds'); //id  参数 集合用于调接口
		ids = JSON.parse(_this.props.getUrlParam('replenishmentArrangeIds'));
	} else if (channelType == BUYINGREQ_CARD.directarrange) {
		//ids = cacheTools.get('directArrangeIds'); //id  参数 集合用于调接口
		ids = JSON.parse(_this.props.getUrlParam('directArrangeIds'));
	} else if (channelType == BUYINGREQ_CARD.srcbilltype4B32) {
		//维修计划
		url = 'list';
		ids = cacheTools.get('4B32TO36D1Pks');
	} else if (channelType == BUYINGREQ_CARD.srcbilltype4B36) {
		//资产工单
		url = 'list';
		ids = cacheTools.get('4B36TO36D1Pks');
	} else if (channelType == 'poplan' || channelType == 'poplansc') {
		ids = JSON.parse(_this.props.getUrlParam('pushId'));
	}
	_this.setState({
		returnURL: '/' + url,
		appcode: appcode,
		returnType: ''
	});
	if (ids) {
		let data = {
			pks: ids,
			pagecode: BUYINGREQ_CARD.cardpageid,
			pk_org: orgid,
			vsrctype: vsrctype,
			channelType: channelType //补货安排
		};
		ajax({
			method: 'POST',
			url: BUYINGREQ_CARD.sotoPraybillURL,
			data: data,
			success: (res) => {
				_this.props.beforeUpdatePage();
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				if (res.data) {
					let array = new Array();
					res.data.map((o) => {
						let datass = {};
						datass.head = o.head;
						datass.body = o.bodys;
						datass.pageid = o.pageid;
						array.push(datass);
					});
					_this.props.transferTable.setTransferListValue(BUYINGREQ_CARD.leftarea, res.data);
					//_this.props.form.setFormStatus(formId, BUYINGREQ_CARD.edit);
					//_this.props.cardTable.setStatus(tableId, BUYINGREQ_CARD.edit);
					_this.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
					_this.props.form.setFormItemsDisabled(formId, { [BUYINGREQ_CARD.pk_org_v]: true });
					RownoUtils.setRowNo(_this.props, tableId, ATTRCODES.crowno);
					//_this.setState({ listdata: array });
					//_this.toggleShow();
				}
				_this.props.updatePage(formId, tableId);
			}
		});
	}
}
function setBtnShow(_this, fbillstatus) {
	if (channelType || type) {
		_this.setParameterForURL(BUYINGREQ_CARD.browse, _this.state.billId);
	}
	//推单标识
	buttonController.setUIState.call(_this, _this.props, BUYINGREQ_CARD.browse);
	buttonController.setCardPaginationVisible(_this.props, true); //设置翻页显示
	buttonController.setBrowseButtonByStatus.call(_this, _this.props, fbillstatus);
	let channelType = _this.props.getUrlParam(BUYINGREQ_CARD.channelType);
	let type = _this.props.getUrlParam(BUYINGREQ_CARD.type);
	if (channelType || type) {
		_this.props.button.setButtonVisible([ BUYINGREQ_CARD_BUTTON.Adds, BUYINGREQ_CARD_BUTTON.Copy ], false);
		buttonController.setBackButtonVisiable.call(_this, _this.props, null);
	}
}
//空白页面控制使用   状态为浏览态  只显示返回按钮，新增按钮
function commonShow(pk) {
	this.setState(
		{
			vbillcode: '',
			copy_billId: ''
		},
		() => {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.vbillcode //修改单据号---非必传
			});
		}
	);
	buttonController.setUIState.call(this, this.props, BUYINGREQ_CARD.browse);
	//设置空白页面的按钮
	buttonController.setBlankPageButtons.call(this);
	this.props.form.EmptyAllFormValue(formId);
	this.props.cardTable.setTableData(tableId, { rows: [] });
	buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示
	//deleteCacheData(this.props, 'pk_praybill', pk, BUYINGREQ_LIST.dataSource);
}
export { setBtnShow };
