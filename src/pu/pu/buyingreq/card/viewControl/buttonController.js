/*
 * @Author: zhangchqf 
 * @PageInfo: 物资需求申请单card页控制器
 * @Date: 2018-12-29 09:33:38 
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-11-25 09:23:54
 */

import { BUYINGREQ_CARD, ATTRCODE, ATTRCODES, BUYINGREQ_CARD_BUTTON, FBILLSTATUS, BUYINGREQ_LIST } from '../../siconst';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { reqBtnControl } from '../../../yyc/ext/yycBtnControl';
let formId = BUYINGREQ_CARD.formId;
let tableId = BUYINGREQ_CARD.tableId;
function setCardPaginationVisible(props, showPage) {
	// 设置卡片分页的显示隐藏
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', showPage);
}

/**
 * 设置返回按钮的可见性
 * @param {*} props
 */
function setBackButtonVisiable(props, parentURL) {
	let status = this.props.getUrlParam(BUYINGREQ_CARD.status);
	//推单标识
	let channelType = this.props.getUrlParam(BUYINGREQ_CARD.channelType);
	let type = this.props.getUrlParam(BUYINGREQ_CARD.type);
	//如果是拉单或者推单页面进入 ，则显示退出转单按钮
	if (type === BUYINGREQ_CARD.transfer || channelType) {
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.state.vbillcode //修改单据号---非必传
		});
		//this.props.form.setFormStatus(BUYINGREQ_CARD.formId, BUYINGREQ_CARD.browse);
		setSagaBtnState.call(this, BUYINGREQ_CARD.browse);
	} else {
		//单据是浏览态
		if (status === BUYINGREQ_CARD.browse) {
			//单据卡片页面
			if (!parentURL) {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: this.state.vbillcode //修改单据号---非必传
				});
			} else {
				//审批中心卡片页面
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: this.state.vbillcode //修改单据号---非必传
				});
			}
			setSagaBtnState.call(this, status);
		} else {
			//新增单据
			if (status === BUYINGREQ_CARD.add) {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: '' //修改单据号---非必传
				});
			} else if (status == BUYINGREQ_CARD.edit) {
				//修改编辑单据
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: this.state.vbillcode //修改单据号---非必传
				});
			}
		}
		setSagaBtnState.call(this, status);
	}
	//设置saga相关按钮状态
	// setSagaBtnState.call(this, status);
}

function isFromApproveCenter(props) {
	let pageMsgType = this.props.getUrlParam('scene');
	if (pageMsgType && pageMsgType == 'approvesce') {
		return true;
	} else {
		return false;
	}
}

/**
 * //1.设置空白页面的按钮
 * @param {*} props 
 * @param {*} fbillstatus 
 */
function setBlankPageButtons() {
	this.props.button.setButtonVisible([ BUYINGREQ_CARD_BUTTON.Adds ], true);
	this.props.button.setButtonVisible(
		[
			BUYINGREQ_CARD_BUTTON.Group1,
			BUYINGREQ_CARD_BUTTON.Edit,
			BUYINGREQ_CARD_BUTTON.Delete,
			BUYINGREQ_CARD_BUTTON.Copy,
			BUYINGREQ_CARD_BUTTON.Commit,
			BUYINGREQ_CARD_BUTTON.Cancel,
			BUYINGREQ_CARD_BUTTON.Group2,
			BUYINGREQ_CARD_BUTTON.BatchUpdate,
			BUYINGREQ_CARD_BUTTON.EditRowNum,
			BUYINGREQ_CARD_BUTTON.Material_PastLast,
			BUYINGREQ_CARD_BUTTON.CloseBill,
			BUYINGREQ_CARD_BUTTON.UnCommit,
			BUYINGREQ_CARD_BUTTON.ApproveInfo,
			BUYINGREQ_CARD_BUTTON.AssistMenu,
			BUYINGREQ_CARD_BUTTON.More,
			BUYINGREQ_CARD_BUTTON.Print,
			BUYINGREQ_CARD_BUTTON.PrintCountQuery,
			BUYINGREQ_CARD_BUTTON.Refresh,
			BUYINGREQ_CARD_BUTTON.Group7,
			BUYINGREQ_CARD_BUTTON.LinkPoPlan,
			BUYINGREQ_CARD_BUTTON.OnhandQuery,
			BUYINGREQ_CARD_BUTTON.OpenBill
		],
		false
	);
}
/**
 * //1.再根据单据状态控制按钮显示
 * @param {*} props 
 * @param {*} fbillstatus 
 */
function setBrowseButtonByStatus(props, fbillstatus) {
	if (fbillstatus == FBILLSTATUS.free) {
		//自由
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Group3,
				BUYINGREQ_CARD_BUTTON.Edit,
				BUYINGREQ_CARD_BUTTON.Delete,
				BUYINGREQ_CARD_BUTTON.Copy,
				BUYINGREQ_CARD_BUTTON.Commit,
				BUYINGREQ_CARD_BUTTON.AssistMenu,
				BUYINGREQ_CARD_BUTTON.More,
				BUYINGREQ_CARD_BUTTON.Print,
				BUYINGREQ_CARD_BUTTON.PrintCountQuery,
				BUYINGREQ_CARD_BUTTON.Refresh,
				BUYINGREQ_CARD_BUTTON.ApproveInfo,
				BUYINGREQ_CARD_BUTTON.LinkPoPlan,
				BUYINGREQ_CARD_BUTTON.OnhandQuery,
				BUYINGREQ_CARD_BUTTON.ShowDraft
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Group1,
				BUYINGREQ_CARD_BUTTON.Cancel,
				BUYINGREQ_CARD_BUTTON.Group2,
				BUYINGREQ_CARD_BUTTON.BatchUpdate,
				BUYINGREQ_CARD_BUTTON.EditRowNum,
				BUYINGREQ_CARD_BUTTON.Material_PastLast,
				BUYINGREQ_CARD_BUTTON.UnCommit,
				BUYINGREQ_CARD_BUTTON.Group7
			],
			false
		);
		//推单标识
		let channelType = this.props.getUrlParam(BUYINGREQ_CARD.channelType);
		let type = this.props.getUrlParam(BUYINGREQ_CARD.type);
		//如果是拉单或者推单页面进入 ，草稿按钮不可见
		if (type === BUYINGREQ_CARD.transfer || channelType) {
			this.props.button.setButtonVisible([ BUYINGREQ_CARD_BUTTON.ShowDraft ], false);
		}
	} else if (fbillstatus == FBILLSTATUS.unapproved) {
		//审批不通过
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Group3,
				BUYINGREQ_CARD_BUTTON.Edit,
				BUYINGREQ_CARD_BUTTON.Delete,
				BUYINGREQ_CARD_BUTTON.Copy,
				BUYINGREQ_CARD_BUTTON.AssistMenu,
				BUYINGREQ_CARD_BUTTON.More,
				BUYINGREQ_CARD_BUTTON.Print,
				BUYINGREQ_CARD_BUTTON.PrintCountQuery,
				BUYINGREQ_CARD_BUTTON.Refresh,
				BUYINGREQ_CARD_BUTTON.ApproveInfo,
				BUYINGREQ_CARD_BUTTON.LinkPoPlan,
				BUYINGREQ_CARD_BUTTON.OnhandQuery
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Commit,
				BUYINGREQ_CARD_BUTTON.Group1,
				BUYINGREQ_CARD_BUTTON.Cancel,
				BUYINGREQ_CARD_BUTTON.Group2,
				BUYINGREQ_CARD_BUTTON.BatchUpdate,
				BUYINGREQ_CARD_BUTTON.EditRowNum,
				BUYINGREQ_CARD_BUTTON.Material_PastLast,
				BUYINGREQ_CARD_BUTTON.UnCommit,
				BUYINGREQ_CARD_BUTTON.Group7
			],
			false
		);
	} else if (fbillstatus == FBILLSTATUS.approve) {
		//审批中
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Group3,
				BUYINGREQ_CARD_BUTTON.Copy,
				BUYINGREQ_CARD_BUTTON.UnCommit,
				BUYINGREQ_CARD_BUTTON.ApproveInfo,
				BUYINGREQ_CARD_BUTTON.AssistMenu,
				BUYINGREQ_CARD_BUTTON.More,
				BUYINGREQ_CARD_BUTTON.Print,
				BUYINGREQ_CARD_BUTTON.PrintCountQuery,
				BUYINGREQ_CARD_BUTTON.Refresh,
				BUYINGREQ_CARD_BUTTON.LinkPoPlan,
				BUYINGREQ_CARD_BUTTON.OnhandQuery
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Group1,
				BUYINGREQ_CARD_BUTTON.Edit,
				BUYINGREQ_CARD_BUTTON.Delete,
				BUYINGREQ_CARD_BUTTON.Commit,
				BUYINGREQ_CARD_BUTTON.Cancel,
				BUYINGREQ_CARD_BUTTON.Group2,
				BUYINGREQ_CARD_BUTTON.BatchUpdate,
				BUYINGREQ_CARD_BUTTON.EditRowNum,
				BUYINGREQ_CARD_BUTTON.Material_PastLast,
				BUYINGREQ_CARD_BUTTON.Group7
			],
			false
		);
	} else if (fbillstatus == FBILLSTATUS.approved) {
		//执行中，审批通过
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Group3,
				BUYINGREQ_CARD_BUTTON.Copy,
				BUYINGREQ_CARD_BUTTON.UnCommit,
				BUYINGREQ_CARD_BUTTON.ApproveInfo,
				BUYINGREQ_CARD_BUTTON.AssistMenu,
				BUYINGREQ_CARD_BUTTON.More,
				BUYINGREQ_CARD_BUTTON.Print,
				BUYINGREQ_CARD_BUTTON.PrintCountQuery,
				BUYINGREQ_CARD_BUTTON.Refresh,
				BUYINGREQ_CARD_BUTTON.Group7,
				BUYINGREQ_CARD_BUTTON.LinkPoPlan,
				BUYINGREQ_CARD_BUTTON.OnhandQuery,
				BUYINGREQ_CARD_BUTTON.CloseBill
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Group1,
				BUYINGREQ_CARD_BUTTON.Edit,
				BUYINGREQ_CARD_BUTTON.Delete,
				BUYINGREQ_CARD_BUTTON.Commit,
				BUYINGREQ_CARD_BUTTON.Cancel,
				BUYINGREQ_CARD_BUTTON.Group2,
				BUYINGREQ_CARD_BUTTON.BatchUpdate,
				BUYINGREQ_CARD_BUTTON.EditRowNum,
				BUYINGREQ_CARD_BUTTON.Material_PastLast,
				BUYINGREQ_CARD_BUTTON.OpenBill
			],
			false
		);
	} else if (fbillstatus == FBILLSTATUS.other) {
		//关闭
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Group3,
				BUYINGREQ_CARD_BUTTON.Copy,
				BUYINGREQ_CARD_BUTTON.ApproveInfo,
				BUYINGREQ_CARD_BUTTON.AssistMenu,
				BUYINGREQ_CARD_BUTTON.More,
				BUYINGREQ_CARD_BUTTON.Print,
				BUYINGREQ_CARD_BUTTON.PrintCountQuery,
				BUYINGREQ_CARD_BUTTON.Refresh,
				BUYINGREQ_CARD_BUTTON.Group7,
				BUYINGREQ_CARD_BUTTON.LinkPoPlan,
				BUYINGREQ_CARD_BUTTON.OnhandQuery,
				BUYINGREQ_CARD_BUTTON.OpenBill
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Group1,
				BUYINGREQ_CARD_BUTTON.Edit,
				BUYINGREQ_CARD_BUTTON.Delete,
				BUYINGREQ_CARD_BUTTON.Commit,
				BUYINGREQ_CARD_BUTTON.Cancel,
				BUYINGREQ_CARD_BUTTON.Group2,
				BUYINGREQ_CARD_BUTTON.BatchUpdate,
				BUYINGREQ_CARD_BUTTON.EditRowNum,
				BUYINGREQ_CARD_BUTTON.Material_PastLast,
				BUYINGREQ_CARD_BUTTON.CloseBill,
				BUYINGREQ_CARD_BUTTON.UnCommit
			],
			false
		);
	} else {
		//提交
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Group3,
				BUYINGREQ_CARD_BUTTON.Copy,
				BUYINGREQ_CARD_BUTTON.More,
				BUYINGREQ_CARD_BUTTON.Print,
				BUYINGREQ_CARD_BUTTON.PrintCountQuery,
				BUYINGREQ_CARD_BUTTON.Refresh,
				BUYINGREQ_CARD_BUTTON.LinkPoPlan,
				BUYINGREQ_CARD_BUTTON.OnhandQuery
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Group1,
				BUYINGREQ_CARD_BUTTON.Edit,
				BUYINGREQ_CARD_BUTTON.Delete,
				BUYINGREQ_CARD_BUTTON.Commit,
				BUYINGREQ_CARD_BUTTON.Cancel,
				BUYINGREQ_CARD_BUTTON.Group2,
				BUYINGREQ_CARD_BUTTON.BatchUpdate,
				BUYINGREQ_CARD_BUTTON.EditRowNum,
				BUYINGREQ_CARD_BUTTON.Material_PastLast,
				BUYINGREQ_CARD_BUTTON.UnCommit,
				BUYINGREQ_CARD_BUTTON.ApproveInfo,
				BUYINGREQ_CARD_BUTTON.AssistMenu
			],
			false
		);
	}
	//----START 友云采按钮控制 add by guozhq-------
	reqBtnControl(props, { isCard: true, cardHeadArea: BUYINGREQ_CARD.formId, billStatusField: ATTRCODE.fbillstatus });
	//----END-------------------------------
}
/**
 * //1.优先根据界面状态判断显示按钮显示
	// 2.再根据单据状态控制按钮显示
 * @param {*} props 
 * @param {*} status 
 * @param {*} param 判断是否从审批中心进入
 */
function setCardButtonVisiable(props, status, param) {
	if (param) {
		this.props.button.setButtonVisible(
			[ BUYINGREQ_CARD_BUTTON.TemporaryStorage, BUYINGREQ_CARD_BUTTON.ShowDraft ],
			false
		);
		//审批中心使用
		let fbillstatus = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.fbillstatus).value;
		//区分请购单维护或者修订的审批中心
		let modifystatus = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.modifystatus).value;
		if (status === BUYINGREQ_CARD.browse) {
			//浏览态
			if (fbillstatus == FBILLSTATUS.approve) {
				//修订的审批中心
				if (modifystatus == 0) {
					this.props.button.setButtonVisible(
						[
							BUYINGREQ_CARD_BUTTON.File,
							BUYINGREQ_CARD_BUTTON.QueryAboutBusiness,
							BUYINGREQ_CARD_BUTTON.Price,
							BUYINGREQ_CARD_BUTTON.Print,
							BUYINGREQ_CARD_BUTTON.PrintCountQuery,
							BUYINGREQ_CARD_BUTTON.Refresh,
							BUYINGREQ_CARD_BUTTON.LinkPoPlan,
							BUYINGREQ_CARD_BUTTON.OnhandQuery
						],
						true
					);
					this.props.button.setButtonVisible(
						[
							BUYINGREQ_CARD_BUTTON.Edit,
							BUYINGREQ_CARD_BUTTON.Save,
							BUYINGREQ_CARD_BUTTON.Cancel,
							BUYINGREQ_CARD_BUTTON.Group2,
							BUYINGREQ_CARD_BUTTON.Material_PastLast,
							BUYINGREQ_CARD_BUTTON.BatchUpdate,
							BUYINGREQ_CARD_BUTTON.EditRowNum
						],
						false
					);
				} else {
					this.props.button.setButtonVisible(
						[
							BUYINGREQ_CARD_BUTTON.Edit,
							BUYINGREQ_CARD_BUTTON.File,
							BUYINGREQ_CARD_BUTTON.QueryAboutBusiness,
							BUYINGREQ_CARD_BUTTON.Price,
							BUYINGREQ_CARD_BUTTON.Print,
							BUYINGREQ_CARD_BUTTON.PrintCountQuery,
							BUYINGREQ_CARD_BUTTON.Refresh,
							BUYINGREQ_CARD_BUTTON.LinkPoPlan,
							BUYINGREQ_CARD_BUTTON.OnhandQuery
						],
						true
					);
					this.props.button.setButtonVisible(
						[
							BUYINGREQ_CARD_BUTTON.Save,
							BUYINGREQ_CARD_BUTTON.Cancel,
							BUYINGREQ_CARD_BUTTON.Group2,
							BUYINGREQ_CARD_BUTTON.Material_PastLast,
							BUYINGREQ_CARD_BUTTON.BatchUpdate,
							BUYINGREQ_CARD_BUTTON.EditRowNum
						],
						false
					);
				}
			} else {
				this.props.button.setButtonVisible(
					[
						BUYINGREQ_CARD_BUTTON.File,
						BUYINGREQ_CARD_BUTTON.QueryAboutBusiness,
						BUYINGREQ_CARD_BUTTON.Price,
						BUYINGREQ_CARD_BUTTON.Print,
						BUYINGREQ_CARD_BUTTON.PrintCountQuery,
						BUYINGREQ_CARD_BUTTON.Refresh,
						BUYINGREQ_CARD_BUTTON.LinkPoPlan,
						BUYINGREQ_CARD_BUTTON.OnhandQuery
					],
					true
				);
				this.props.button.setButtonVisible(
					[
						BUYINGREQ_CARD_BUTTON.Edit,
						BUYINGREQ_CARD_BUTTON.Save,
						BUYINGREQ_CARD_BUTTON.Cancel,
						BUYINGREQ_CARD_BUTTON.Group2,
						BUYINGREQ_CARD_BUTTON.Material_PastLast,
						BUYINGREQ_CARD_BUTTON.BatchUpdate,
						BUYINGREQ_CARD_BUTTON.EditRowNum
					],
					false
				);
			}
		} else {
			//编辑态
			this.props.button.setButtonVisible(
				[
					BUYINGREQ_CARD_BUTTON.Save,
					BUYINGREQ_CARD_BUTTON.Cancel,
					BUYINGREQ_CARD_BUTTON.Group2,
					BUYINGREQ_CARD_BUTTON.BatchUpdate,
					BUYINGREQ_CARD_BUTTON.EditRowNum,
					BUYINGREQ_CARD_BUTTON.OnhandQuery
				],
				true
			);
			this.props.button.setButtonVisible(
				[
					BUYINGREQ_CARD_BUTTON.Edit,
					BUYINGREQ_CARD_BUTTON.File,
					BUYINGREQ_CARD_BUTTON.QueryAboutBusiness,
					BUYINGREQ_CARD_BUTTON.Price,
					BUYINGREQ_CARD_BUTTON.Print,
					BUYINGREQ_CARD_BUTTON.PrintCountQuery,
					BUYINGREQ_CARD_BUTTON.Material_PastLast,
					BUYINGREQ_CARD_BUTTON.LinkPoPlan,
					BUYINGREQ_CARD_BUTTON.Refresh
				],
				false
			);
		}
	} else {
		//请购单卡卡片页使用
		if (status === BUYINGREQ_CARD.browse) {
			//跳转浏览在pageInfoClick 中进行单独控制，保存后进行渲染走此处
			//自由
			this.props.button.setButtonVisible(
				[
					BUYINGREQ_CARD_BUTTON.Group3,
					BUYINGREQ_CARD_BUTTON.Edit,
					BUYINGREQ_CARD_BUTTON.Delete,
					BUYINGREQ_CARD_BUTTON.Copy,
					BUYINGREQ_CARD_BUTTON.Commit,
					BUYINGREQ_CARD_BUTTON.AssistMenu,
					BUYINGREQ_CARD_BUTTON.More,
					BUYINGREQ_CARD_BUTTON.Print,
					BUYINGREQ_CARD_BUTTON.PrintCountQuery,
					BUYINGREQ_CARD_BUTTON.Refresh,
					BUYINGREQ_CARD_BUTTON.ApproveInfo,
					BUYINGREQ_CARD_BUTTON.LinkPoPlan,
					BUYINGREQ_CARD_BUTTON.OnhandQuery,
					BUYINGREQ_CARD_BUTTON.ShowDraft
				],
				true
			);
			this.props.button.setButtonVisible(
				[
					BUYINGREQ_CARD_BUTTON.Group1,
					BUYINGREQ_CARD_BUTTON.Cancel,
					BUYINGREQ_CARD_BUTTON.Group2,
					BUYINGREQ_CARD_BUTTON.BatchUpdate,
					BUYINGREQ_CARD_BUTTON.EditRowNum,
					BUYINGREQ_CARD_BUTTON.UnCommit,
					BUYINGREQ_CARD_BUTTON.Group7
				],
				false
			);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true); //设置翻页显示
		} else {
			//编辑态,新增
			this.props.button.setButtonVisible(
				[
					BUYINGREQ_CARD_BUTTON.Group1,
					BUYINGREQ_CARD_BUTTON.Cancel,
					BUYINGREQ_CARD_BUTTON.Group2,
					BUYINGREQ_CARD_BUTTON.OnhandQuery,
					BUYINGREQ_CARD_BUTTON.BatchUpdate,
					BUYINGREQ_CARD_BUTTON.EditRowNum,
					BUYINGREQ_CARD_BUTTON.ShowDraft
				],
				true
			);
			this.props.button.setButtonVisible(
				[
					BUYINGREQ_CARD_BUTTON.Group3,
					BUYINGREQ_CARD_BUTTON.Commit,
					BUYINGREQ_CARD_BUTTON.More,
					BUYINGREQ_CARD_BUTTON.UnCommit,
					BUYINGREQ_CARD_BUTTON.ApproveInfo,
					BUYINGREQ_CARD_BUTTON.Material_PastLast,
					BUYINGREQ_CARD_BUTTON.AssistMenu,
					BUYINGREQ_CARD_BUTTON.Print,
					BUYINGREQ_CARD_BUTTON.PrintCountQuery,
					BUYINGREQ_CARD_BUTTON.LinkPoPlan,
					BUYINGREQ_CARD_BUTTON.Refresh
				],
				false
			);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
			lineSelected.call(this, this.props);
			//新增时，执行光标聚焦
			if (status != BUYINGREQ_CARD.edit && status != BUYINGREQ_CARD.browse) {
				this.props.executeAutoFocus();
			}
		}
	}
	//推单标识
	let channelType = this.props.getUrlParam(BUYINGREQ_CARD.channelType);
	let type = this.props.getUrlParam(BUYINGREQ_CARD.type);
	//如果是拉单或者推单页面进入 ，暂存按钮可见不可用
	if (type === BUYINGREQ_CARD.transfer || channelType) {
		this.props.button.setButtonVisible([ BUYINGREQ_CARD_BUTTON.ShowDraft ], false);
	}
	//----START 友云采按钮控制 add by guozhq-------
	reqBtnControl(props, { isCard: true, cardHeadArea: BUYINGREQ_CARD.formId, billStatusField: ATTRCODE.fbillstatus });
	//----END-------------------------------
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status
 */
function setUIState(props, status) {
	if (status === BUYINGREQ_CARD.browse) {
		this.props.form.setFormStatus(formId, status);
		this.props.cardTable.setStatus(tableId, status);
	} else {
		this.props.form.setFormStatus(formId, BUYINGREQ_CARD.edit);
		this.props.cardTable.setStatus(tableId, BUYINGREQ_CARD.edit);
	}
}
/**
 * //根据单据的状态控制行按钮显示
 * @param {*} props
 * * @param {*} record
 * * @param {*} param  判断是否是从审批中心进入的卡片页
 * * @param {*} index
 *
 */
function setRowButtons(props, record, param, index) {
	let fbillstatus = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.fbillstatus).value;
	let bclose = record.values.browclose; //单据行状态
	if (bclose) {
		bclose = bclose.value;
	} else {
		bclose = false;
	}
	let state = props.getUrlParam(BUYINGREQ_CARD.status);
	//推单
	let channelType = props.getUrlParam(BUYINGREQ_CARD.channelType);
	//拉单
	let transfer = props.getUrlParam(BUYINGREQ_CARD.type);
	if (channelType || transfer) {
		//拉单或者推单时，状态使用 this.state.status
		state = this.state.status;
	}
	if (param) {
		let buttonAry = [];
		let openorclose = '';
		if (this.state.lineShowType[index] == 1) {
			openorclose = BUYINGREQ_CARD_BUTTON.CloseRow;
		} else {
			openorclose = BUYINGREQ_CARD_BUTTON.OpenRow;
		}
		if (state == BUYINGREQ_CARD.browse) {
			buttonAry = [ openorclose, BUYINGREQ_CARD_BUTTON.LinkPoPlan ];
		} else if ((state == BUYINGREQ_CARD.edit || state == BUYINGREQ_CARD.add) && this.copyRowDatas == null) {
			buttonAry = [ openorclose, BUYINGREQ_CARD_BUTTON.Delete_row, BUYINGREQ_CARD_BUTTON.InsertLine ];
		} else {
			buttonAry = [ BUYINGREQ_CARD_BUTTON.PasteThis ];
		}
		return buttonAry;
	} else {
		//页面状态为浏览&&单据状态为审批&&行关闭
		//页面状态为浏览&&单据状态为审批&&行打开
		//页面状态为浏览&&单据状态为关闭
		//页面状态为浏览&&（单据状态为自由、审批中、提交、审批不通过）
		//编辑态
		let buttonAry = [];
		let openorclose = '';
		if (this.state.lineShowType[index] == 1) {
			openorclose = BUYINGREQ_CARD_BUTTON.CloseRow;
		} else {
			openorclose = BUYINGREQ_CARD_BUTTON.OpenRow;
		}
		if (state == BUYINGREQ_CARD.browse && fbillstatus == FBILLSTATUS.approved && bclose) {
			buttonAry = [ openorclose, BUYINGREQ_CARD_BUTTON.LinkPoPlan, BUYINGREQ_CARD_BUTTON.LineOpen ];
		} else if (state == BUYINGREQ_CARD.browse && fbillstatus == FBILLSTATUS.approved && !bclose) {
			buttonAry = [ openorclose, BUYINGREQ_CARD_BUTTON.LinkPoPlan, BUYINGREQ_CARD_BUTTON.LineClose ];
		} else if (state == BUYINGREQ_CARD.browse && fbillstatus == FBILLSTATUS.other) {
			buttonAry = [ openorclose, BUYINGREQ_CARD_BUTTON.LinkPoPlan, BUYINGREQ_CARD_BUTTON.LineOpen ];
		} else if (
			state == BUYINGREQ_CARD.browse &&
			(fbillstatus == FBILLSTATUS.free ||
				fbillstatus == FBILLSTATUS.approve ||
				fbillstatus == FBILLSTATUS.commit ||
				fbillstatus == FBILLSTATUS.unapproved)
		) {
			buttonAry = [ openorclose, BUYINGREQ_CARD_BUTTON.LinkPoPlan ];
		} else if ((state == BUYINGREQ_CARD.edit || state == BUYINGREQ_CARD.add) && this.copyRowDatas == null) {
			buttonAry = [ openorclose, BUYINGREQ_CARD_BUTTON.Delete_row, BUYINGREQ_CARD_BUTTON.InsertLine ];
		} else {
			buttonAry = [ BUYINGREQ_CARD_BUTTON.PasteThis ];
		}
		return buttonAry;
	}
}
/**
 * //根据勾选行控制肩部按钮
 * @param {*} props
 *
 */
function lineSelected(props) {
	let rowsdata = this.props.cardTable.getCheckedRows(BUYINGREQ_CARD.tableId);
	let rowsflag = true; //根据勾选行数控制肩部可用按钮
	let pk_org = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org);
	let hava_pkorg = true; //根据主组织控制增行的可用性
	let onhandflag = true; //控制存量查拣按钮可用性
	let linkPoPlanFlag = true; // 控制联查采购计划按钮可用性
	if (pk_org && pk_org.value && this.props.cardTable.getAllRows(BUYINGREQ_CARD.tableId).length) {
		onhandflag = false;
	} else if (this.props.getUrlParam(BUYINGREQ_CARD.status) == BUYINGREQ_CARD.browse) {
		onhandflag = false;
	}
	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	if (pk_org && pk_org.value) {
		hava_pkorg = false;
	}
	if (this.props.getUrlParam(BUYINGREQ_CARD.status) == BUYINGREQ_CARD.browse && rowsdata.length > 0) {
		linkPoPlanFlag = false;
	}
	let disableArr = {
		[BUYINGREQ_CARD_BUTTON.AddLine]: hava_pkorg,
		[BUYINGREQ_CARD_BUTTON.DeleteLine]: rowsflag,
		[BUYINGREQ_CARD_BUTTON.CopyLine]: rowsflag,
		[BUYINGREQ_CARD_BUTTON.LinkPoPlan]: linkPoPlanFlag,
		[BUYINGREQ_CARD_BUTTON.OnhandQuery]: onhandflag,
		[BUYINGREQ_CARD_BUTTON.EditRowNum]: hava_pkorg
	};
	this.props.button.setDisabled(disableArr);
}
function setSagaBtnState(status) {
	let sagaStatus = this.props.form.getFormItemsValue([ BUYINGREQ_CARD.formId ], ATTRCODE.sagaStatus);
	//status = BUYINGREQ_CARD.browse; // 第一次进入卡片页，frozen为空，取界面sags_statue的值判断冻结状态
	let frozen = sagaStatus && sagaStatus.value == '1' ? true : false;
	// 设置回退、重试按钮状态，用来是否显示
	if (status == BUYINGREQ_CARD.browse && frozen) {
		this.props.button.toggleErrorStatus(BUYINGREQ_CARD.formId, {
			isError: true
		});
	} else {
		this.props.button.toggleErrorStatus(BUYINGREQ_CARD.formId, {
			isError: false
		});
	}
}
export default {
	setRowButtons,
	setCardButtonVisiable,
	setCardPaginationVisible,
	setUIState,
	setBackButtonVisiable,
	setBrowseButtonByStatus,
	setBlankPageButtons,
	lineSelected
};
