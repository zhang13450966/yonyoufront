/*
 * @Author: zhaochyu
 * @PageInfo: 卡片界面
 * @Date: 2018-04-28 16:04:40
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-10-21 10:48:26
 */

//主子表卡片
import React, { Component } from 'react';
import { createPage, ajax, base, high } from 'nc-lightapp-front';
const { BillTrack } = high;
import ExcelOutput from 'uap/common/components/ExcelOutput';
import NCUploader from 'uap/common/components/NCUploader';
let { NCAffix } = base;
import { initTemplate } from './init';
import {
	FIELD,
	URL,
	PAGECODE,
	UISTATE,
	CARD_BUTTON,
	AREA,
	TRANSFER,
	DATASOURCE,
	HEAD_FIELD,
	ATTRCODES
} from '../constance';
import { pageInfoClick } from './btnClicks';
import { afterEvent } from './afterEvents';
import { beforeEvent } from './beforeEvents';
import { backTransferBtnClick } from './btnClicks';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
import { btnClickController } from '../card/viewControl';
import { buttonController } from '../card/viewControl';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { RownoUtils } from '../../../../scmpub/scmpub/pub/tool/cardTableTools';
const { NCDiv } = base;
class InitialestCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(PAGECODE.cardhead);
		props.use.cardTable(PAGECODE.cardbody);
		this.totalnum = '';
		this.curindex = 0;
		this.totalprice = '';
		this.state = {
			status: UISTATE.edit,
			backstatus: UISTATE.browse,
			showTrack: false,
			pk: '',
			vbillcode: '',
			target: null,
			showUploader: false,
			flag: '0', //是否点击复制行，改变操作列的显示按钮
			listdata: '', //转单后编辑数据缓存
			currentindex: 0, //转单后编辑数据缓存
			rechangeState: '' //渲染state
		}; //上传控件以target位置为基准，不传则默认正中央 //控制弹框 //是否是自制 //是否拉采购订单
		//initTemplate.call(this, this.props);
		this.indexstatus = {};
		initLang(this, [ '4004initialest' ], 'pu', initTemplate.bind(this, this.props));
	}
	// 渲染页面前，执行的方法
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(PAGECODE.cardbody);
			if (status == UISTATE.edit) {
				return getLangByResId(this, '4004INITIALEST-000015'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	// 渲染页面后，执行的方法
	componentDidMount() {
		this.selfmakeAndref21();
		let transfer = this.props.getUrlParam(FIELD.cardStatus) === FIELD.transfer;
		if (transfer) {
			let transferIds = this.props.transferTable.getTransferTableSelectedId(AREA.cardFormArea);
			this.getTransferValue(transferIds);
			this.props.cardTable.setStatus(AREA.cardTableArea, UISTATE.edit);
			this.props.form.setFormStatus(AREA.cardFormArea, UISTATE.edit);
		}
		let vbillcode =
			this.props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.vbillcode) == null
				? null
				: this.props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.vbillcode).value;
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: vbillcode
		});
	}
	//得到转单页面值
	getTransferValue = (ids) => {
		let data = {
			data: ids, //pagecode: PAGECODE.transfercard,
			pagecode: PAGECODE.cardpagecode,
			queryAreaCode: AREA.searchArea,
			oid: TRANSFER.oid
		};
		let _this = this;
		ajax({
			method: 'POST',
			url: URL.transferOrder,
			data: data,
			success: (res) => {
				if (res && res.data) {
					let array = new Array();
					res.data.map((o) => {
						let datass = {};
						datass.head = o.head;
						datass.body = o.body;
						datass.pageid = o.pageid;
						array.push(datass);
					});
					this.setState({ listdata: array });
					this.props.transferTable.setTransferListValue(AREA.leftarea, res.data);
					transtypeUtils.setValue.call(
						this,
						PAGECODE.cardhead,
						HEAD_FIELD.ctrantypeid,
						HEAD_FIELD.vtrantypecode
					);
					this.props.form.setFormStatus(AREA.cardFormArea, UISTATE.edit);
					this.props.cardTable.setStatus(AREA.cardTableArea, UISTATE.edit);
				}
			}
		});
	};
	//根据是否配置业务流来控制自制和采购订单的可见性
	selfmakeAndref21 = () => {
		this.props.button.setButtonVisible(
			[ CARD_BUTTON.Selfmake ],
			getDefData(DATASOURCE.dataSource, FIELD.isSelfMake)
		);
		this.props.button.setButtonVisible([ CARD_BUTTON.Puorder ], getDefData(DATASOURCE.dataSource, FIELD.isref21));
	};
	// 附件管理关闭
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};
	//切换页面状态所有按钮的可见性
	toggleShow = (isEdit, billStatus) => {
		let status = '';
		let billstatus = '';
		if (isEdit != null && billStatus != null) {
			status = isEdit;
			billstatus = billStatus;
		} else {
			status = this.props.getUrlParam(FIELD.cardStatus);
			billstatus = this.props.getUrlParam(FIELD.fbillstatus);
		}
		if (status == UISTATE.browse) {
			buttonController.setBrowseButtonByStatus.call(this, this.props, billstatus);
		}
		if (status == UISTATE.add) {
			this.props.executeAutoFocus();
		}
		if (status == UISTATE.edit || status == UISTATE.add) {
			buttonController.setEditButtonByStatus.call(this, this.props, status);
		}
		buttonController.setUIState.call(this, this.props, status);
	};
	//获取列表肩部信息
	getTableHead = () => {
		return (
			<div>
				{this.props.button.createButtonApp({
					area: PAGECODE.cardbody,
					ignoreHotkeyCode: getCardDisableHotKeyBtn(),
					onButtonClick: btnClickController.bind(this)
				})}
			</div>
		);
	};
	render() {
		let { cardTable, form, cardPagination, transferTable } = this.props;
		let { createForm } = form;
		let { createTransferList } = transferTable;
		let { createCardTable } = cardTable;
		const { socket } = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let { createCardPagination } = cardPagination;
		let { showUploader, target } = this.state;
		let transferpk = this.props.getUrlParam('id');
		let transfer = this.props.getUrlParam(FIELD.cardStatus) === FIELD.transfer;
		//光标默认聚焦关闭
		this.props.controlAutoFocus(true);
		if (transfer) {
			return (
				<div className="nc-bill-transferList">
					{this.createConnectMesg(socket)}
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<span>
								{createCardTitle(this, {
									billCode: '', //单据号
									backBtnClick: () => {
										//返回按钮的点击事件
										backTransferBtnClick.call(this, this.props);
									}
								})}
							</span>
							<div className="header-button-area">
								{/* 按钮区 */}
								{this.props.button.createErrorFlag({
									headBtnAreaCode: AREA.cardFormArea
								})}
								{this.props.button.createButtonApp({
									area: PAGECODE.cardhead,
									onButtonClick: btnClickController.bind(this)
								})}
								{/* 单据追溯 */}
								<BillTrack
									show={this.state.showTrack}
									close={() => {
										this.setState({ showTrack: false });
									}}
									pk={this.state.pk.value}
									type="4T"
								/>
								<ExcelOutput
									{...Object.assign(this.props)}
									moduleName="pu"
									billType="4T"
									pagecode="400402800_card"
									appcode="400402800"
									exportTreeUrl={URL.exportset}
									//referVO={{ ignoreTemplate: true }}
								/>
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-transferList-content">
						{createTransferList({
							dataSource: DATASOURCE.transferdataSource,
							headcode: PAGECODE.cardhead, //表格组件id
							bodycode: PAGECODE.cardbody,
							transferListId: AREA.leftarea, //转单列表id
							onTransferItemSelected: (record, status, index) => {
								let fbillstatus = record.head.card_head.rows[0].values.fbillstatus.value;
								this.curindex = parseInt(index);
								let isEdit = status ? UISTATE.browse : UISTATE.edit;
								if (this.indexstatus[index]) {
									if (this.indexstatus[index] == UISTATE.browse) {
										isEdit = UISTATE.browse;
									} else if (this.indexstatus[index] == UISTATE.edit) {
										isEdit = UISTATE.edit;
									}
								}
								this.indexstatus[index] = isEdit;
								//渲染表头
								this.props.form.setAllFormValue({
									[PAGECODE.cardhead]: record.head[PAGECODE.cardhead]
								});
								this.props.cardTable.setTableData(PAGECODE.cardbody, record.body[PAGECODE.cardbody]);
								let num = this.props.transferTable.getTransformFormAmount(AREA.leftarea);
								//设置按钮的显隐性
								buttonController.setCardTransferButtonVisiable.call(this, isEdit, fbillstatus);
								let onecode = record.head.card_head.rows[0].values.vbillcode.value;
								transferpk = record.head.card_head.rows[0].values.pk_initialest.value;
								if (num == 1 || isEdit == UISTATE.browse) {
									this.props.BillHeadInfo.setBillHeadInfoVisible({
										showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
										billCode: onecode //修改单据号---非必传
									});
								}
							},
							componentInitFinished: () => {
								//缓存数据赋值成功的钩子函数
								//若初始化数据后需要对数据做修改，可以在这里处理
							},
							onTransferItemClick: (record, index, status) => {
								//单据号切换
								let vbillcode = record.head.card_head.rows[0].values.vbillcode.value;
								if (vbillcode && vbillcode !== 'null') {
									this.props.BillHeadInfo.setBillHeadInfoVisible({
										showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
										billCode: vbillcode //修改单据号---非必传
									});
								} else {
									this.props.BillHeadInfo.setBillHeadInfoVisible({
										showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
										billCode: '' //修改单据号---非必传
									});
								}
								//点击转单缩略图的钩子函数
								this.curindex = parseInt(index);
								//let isEdit = status ? UISTATE.browse : UISTATE.edit;
								let isEdit = status ? UISTATE.browse : UISTATE.edit;
								if (this.indexstatus[index]) {
									if (this.indexstatus[index] == UISTATE.browse) {
										isEdit = UISTATE.browse;
									} else if (this.indexstatus[index] == UISTATE.edit) {
										isEdit = UISTATE.edit;
									}
								}
								this.indexstatus[index] = isEdit;
								this.props.form.setAllFormValue({
									[PAGECODE.cardhead]: record.head[PAGECODE.cardhead]
								});
								let fbillstatus = record.head.card_head.rows[0].values.fbillstatus.value;
								this.props.cardTable.setTableData(PAGECODE.cardbody, record.body[PAGECODE.cardbody]);
								transferpk = record.head.card_head.rows[0].values.pk_initialest.value;
								buttonController.setCardTransferButtonVisiable.call(this, isEdit, fbillstatus);
							}
						})}
						<div className="transferList-content-right nc-bill-card">
							<div className="nc-bill-form-area">
								{createForm(PAGECODE.cardhead, {
									expandddArr: [ PAGECODE.childform3 ],
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: beforeEvent.bind(this)
								})}
							</div>
							<div className="nc-bill-table-area">
								{createCardTable(PAGECODE.cardbody, {
									tableHead: this.getTableHead.bind(this),
									onSelected: buttonController.lineSelected.bind(this, this.props),
									onSelectedAll: buttonController.lineSelected.bind(this, this.props),
									showCheck: true,
									hideModelSave: true,
									modelAddRow: () => {
										RownoUtils.setRowNo(this.props, AREA.cardTableArea, ATTRCODES.crowno);
									},
									showIndex: true,
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: beforeEvent.bind(this),
									adaptionHeight: true
								})}
							</div>
							<div>
								{/* 附件上传组件使用，需要传入三个参数 */}
								{showUploader && (
									<NCUploader
										billId={transferpk}
										target={target}
										placement={''}
										onHide={this.onHideUploader}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			let pk_initialest = this.props.getUrlParam('id');
			return (
				<div className="nc-bill-card" id="preliminary-pu-initialest-card">
					{this.createConnectMesg(socket)}
					<div className="nc-bill-top-area">
						<NCAffix>
							<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
								<span>
									{createCardTitle(this, {
										billCode: '', //单据号
										backBtnClick: () => {
											//返回按钮的点击事件
											this.props.pushTo(URL.listurl, {
												pagecode: PAGECODE.listpagecode
											});
										}
									})}
								</span>
								<div className="header-button-area">
									{/* 按钮区 */}
									{/* {this.props.button.createHeaderButton({
										formAreaCode: AREA.cardFormArea,
										headBtnAreaCode: AREA.cardFormArea,
										showBack: false //不显示回退按钮，默认显示
									})} */}
									{this.props.button.createErrorFlag({
										headBtnAreaCode: AREA.cardFormArea
									})}

									{this.props.button.createButtonApp({
										area: PAGECODE.cardhead,
										onButtonClick: btnClickController.bind(this)
									})}
									{/* 单据追溯 */}
									<BillTrack
										show={this.state.showTrack}
										close={() => {
											this.setState({ showTrack: false });
										}}
										pk={this.state.pk.value}
										type="4T"
									/>
									<ExcelOutput
										{...Object.assign(this.props)}
										moduleName="pu"
										billType="4T"
										pagecode="400402800_card"
										appcode="400402800"
										exportTreeUrl={URL.exportset}
									/>
								</div>
								<div className="header-cardPagination-area" style={{ float: 'right' }}>
									{/* 上一页/下一页 */}
									{createCardPagination({
										handlePageInfoChange: pageInfoClick.bind(this),
										dataSource: DATASOURCE.dataSource
									})}
								</div>
							</NCDiv>
						</NCAffix>
						<div className="nc-bill-form-area">
							{createForm(PAGECODE.cardhead, {
								expandddArr: [ PAGECODE.childform3 ],
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: beforeEvent.bind(this)
							})}
						</div>
					</div>
					<div className="nc-bill-bottom-area">
						<div className="nc-bill-table-area">
							{createCardTable(PAGECODE.cardbody, {
								tableHead: this.getTableHead.bind(this),
								onSelected: buttonController.lineSelected.bind(this, this.props),
								onSelectedAll: buttonController.lineSelected.bind(this, this.props),
								hideModelSave: true,
								modelAddRow: () => {
									RownoUtils.setRowNo(this.props, AREA.cardTableArea, ATTRCODES.crowno);
								},
								showCheck: true,
								showIndex: true,
								//isAddRow: true,
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: beforeEvent.bind(this),
								adaptionHeight: true
							})}
						</div>
						<div>
							{/* 附件上传组件使用，需要传入三个参数 */}
							{showUploader && (
								<NCUploader
									billId={pk_initialest}
									target={target}
									placement={''}
									onHide={this.onHideUploader}
								/>
							)}
						</div>
					</div>
				</div>
			);
		}
	}
	createConnectMesg = (socket) => {
		return (
			<div>
				{socket.connectMesg({
					headBtnAreaCode: AREA.cardFormArea, // 表头按钮区域ID
					formAreaCode: AREA.cardFormArea, // 表头Form区域ID
					billtype: '4T',
					billpkname: FIELD.pk_initialest,
					dataSource: DATASOURCE.dataSource
				})}
			</div>
		);
	};
}
InitialestCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: PAGECODE.cardpagecode,
		headcode: PAGECODE.cardhead,
		bodycode: {
			[PAGECODE.cardbody]: 'cardTable' //此处发生变化了，需要传一个对象
		}
	},
	orderOfHotKey: [ PAGECODE.cardhead, PAGECODE.cardbody ]
})(InitialestCard);
export default InitialestCard;
