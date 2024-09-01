/*
 * @Author: zhangchqf 
 * @PageInfo: 物资需求申请单card页控制器
 * @Date: 2018-12-29 09:33:38 
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-11-25 09:45:09
 */

import { STOREREQ_CARD, ATTRCODE, ATTRCODES, STOREREQ_CARD_BUTTON, FBILLSTATUS, STOREREQ_LIST } from '../../siconst';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
let formId = STOREREQ_CARD.formId;
let tableId = STOREREQ_CARD.tableId;
//let param = getParentURlParme(STOREREQ_CARD.pageMsgType);
function setCardPaginationVisible(props, showPage) {
	// 设置卡片分页的显示隐藏
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', showPage);
}

/**
 * 设置返回按钮的可见性
 * @param {*} props
 */
function setBackButtonVisiable(props, param) {
	let status = props.getUrlParam(STOREREQ_CARD.status);
	if (!status) {
		status = STOREREQ_CARD.add;
	}
	let type = props.getUrlParam(STOREREQ_CARD.type);
	//如果是拉单或者推单页面进入 ，则显示退出转单按钮
	if (type) {
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.state.vbillcode //修改单据号---非必传
		});
	} else {
		if (status === STOREREQ_CARD.browse) {
			if (!param && this.PU_STOREREQ_TYPE == 'N') {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: this.state.vbillcode //修改单据号---非必传
				});
			} else {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: this.state.vbillcode //修改单据号---非必传
				});
			}
		} else if (status == STOREREQ_CARD.add) {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: '' //修改单据号---非必传
			});
		} else if (status == STOREREQ_CARD.edit) {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.vbillcode //修改单据号---非必传
			});
		}
	}
	//设置saga相关按钮状态
	setSagaBtnState.call(this, status);
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
	this.props.button.setButtonVisible([ STOREREQ_CARD_BUTTON.Add ], true);
	this.props.button.setButtonVisible(
		[
			STOREREQ_CARD_BUTTON.Group1,
			STOREREQ_CARD_BUTTON.Cancel,
			STOREREQ_CARD_BUTTON.Group2,
			STOREREQ_CARD_BUTTON.Material_PastLast,
			STOREREQ_CARD_BUTTON.BatchUpdate,
			STOREREQ_CARD_BUTTON.EditRowNum,
			STOREREQ_CARD_BUTTON.UnCommit,
			STOREREQ_CARD_BUTTON.Group7,
			STOREREQ_CARD_BUTTON.Edit,
			STOREREQ_CARD_BUTTON.Delete,
			STOREREQ_CARD_BUTTON.Copy,
			STOREREQ_CARD_BUTTON.Commit,
			STOREREQ_CARD_BUTTON.AssistMenu,
			STOREREQ_CARD_BUTTON.File,
			STOREREQ_CARD_BUTTON.More,
			STOREREQ_CARD_BUTTON.Print,
			STOREREQ_CARD_BUTTON.PrintCountQuery,
			STOREREQ_CARD_BUTTON.Refresh,
			STOREREQ_CARD_BUTTON.ApproveInfo,
			STOREREQ_CARD_BUTTON.OnhandQuery
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
	this.props.button.setButtonVisible([ STOREREQ_CARD_BUTTON.ShowDraft ], true);
	if (fbillstatus == FBILLSTATUS.free) {
		//自由
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group3,
				STOREREQ_CARD_BUTTON.Edit,
				STOREREQ_CARD_BUTTON.Delete,
				STOREREQ_CARD_BUTTON.Copy,
				STOREREQ_CARD_BUTTON.Commit,
				STOREREQ_CARD_BUTTON.AssistMenu,
				STOREREQ_CARD_BUTTON.File,
				STOREREQ_CARD_BUTTON.More,
				STOREREQ_CARD_BUTTON.Print,
				STOREREQ_CARD_BUTTON.PrintCountQuery,
				STOREREQ_CARD_BUTTON.Refresh,
				STOREREQ_CARD_BUTTON.ApproveInfo,
				STOREREQ_CARD_BUTTON.OnhandQuery
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group1,
				STOREREQ_CARD_BUTTON.Cancel,
				STOREREQ_CARD_BUTTON.Group2,
				STOREREQ_CARD_BUTTON.Material_PastLast,
				STOREREQ_CARD_BUTTON.BatchUpdate,
				STOREREQ_CARD_BUTTON.EditRowNum,
				STOREREQ_CARD_BUTTON.UnCommit,
				STOREREQ_CARD_BUTTON.Group7
			],
			false
		);

		let type = this.props.getUrlParam(STOREREQ_CARD.type);
		//如果是拉单或者推单页面进入 ，草稿按钮不可见
		if (type === STOREREQ_CARD.transfer) {
			this.props.button.setButtonVisible([ STOREREQ_CARD_BUTTON.ShowDraft ], false);
		}
	} else if (fbillstatus == FBILLSTATUS.unapproved) {
		//审批不通过
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group3,
				STOREREQ_CARD_BUTTON.Copy,
				STOREREQ_CARD_BUTTON.AssistMenu,
				STOREREQ_CARD_BUTTON.File,
				STOREREQ_CARD_BUTTON.More,
				STOREREQ_CARD_BUTTON.Print,
				STOREREQ_CARD_BUTTON.PrintCountQuery,
				STOREREQ_CARD_BUTTON.Refresh,
				STOREREQ_CARD_BUTTON.ApproveInfo,
				STOREREQ_CARD_BUTTON.OnhandQuery
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group1,
				STOREREQ_CARD_BUTTON.Cancel,
				STOREREQ_CARD_BUTTON.Group2,
				STOREREQ_CARD_BUTTON.Material_PastLast,
				STOREREQ_CARD_BUTTON.Commit,
				STOREREQ_CARD_BUTTON.BatchUpdate,
				STOREREQ_CARD_BUTTON.EditRowNum,
				STOREREQ_CARD_BUTTON.UnCommit,
				STOREREQ_CARD_BUTTON.Group7
			],
			false
		);
	} else if (fbillstatus == FBILLSTATUS.approve) {
		//审批中
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group3,
				STOREREQ_CARD_BUTTON.Copy,
				STOREREQ_CARD_BUTTON.UnCommit,
				STOREREQ_CARD_BUTTON.ApproveInfo,
				STOREREQ_CARD_BUTTON.AssistMenu,
				STOREREQ_CARD_BUTTON.File,
				STOREREQ_CARD_BUTTON.More,
				STOREREQ_CARD_BUTTON.Print,
				STOREREQ_CARD_BUTTON.PrintCountQuery,
				STOREREQ_CARD_BUTTON.Refresh,
				STOREREQ_CARD_BUTTON.OnhandQuery
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group1,
				STOREREQ_CARD_BUTTON.Edit,
				STOREREQ_CARD_BUTTON.Delete,
				STOREREQ_CARD_BUTTON.Commit,
				STOREREQ_CARD_BUTTON.Cancel,
				STOREREQ_CARD_BUTTON.Group2,
				STOREREQ_CARD_BUTTON.Material_PastLast,
				STOREREQ_CARD_BUTTON.BatchUpdate,
				STOREREQ_CARD_BUTTON.EditRowNum,
				STOREREQ_CARD_BUTTON.Group7,
				STOREREQ_CARD_BUTTON.CloseBill,
				STOREREQ_CARD_BUTTON.OpenBill
			],
			false
		);
	} else if (fbillstatus == FBILLSTATUS.approved) {
		//执行中，审批通过
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group3,
				STOREREQ_CARD_BUTTON.Copy,
				STOREREQ_CARD_BUTTON.UnCommit,
				STOREREQ_CARD_BUTTON.More,
				STOREREQ_CARD_BUTTON.Print,
				STOREREQ_CARD_BUTTON.PrintCountQuery,
				STOREREQ_CARD_BUTTON.Refresh,
				STOREREQ_CARD_BUTTON.AssistMenu,
				STOREREQ_CARD_BUTTON.ApproveInfo,
				STOREREQ_CARD_BUTTON.OnhandQuery,
				STOREREQ_CARD_BUTTON.CloseBill
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group1,
				STOREREQ_CARD_BUTTON.Edit,
				STOREREQ_CARD_BUTTON.Delete,
				STOREREQ_CARD_BUTTON.Commit,
				STOREREQ_CARD_BUTTON.Cancel,
				STOREREQ_CARD_BUTTON.Group2,
				STOREREQ_CARD_BUTTON.Material_PastLast,
				STOREREQ_CARD_BUTTON.BatchUpdate,
				STOREREQ_CARD_BUTTON.EditRowNum,
				STOREREQ_CARD_BUTTON.OpenBill
			],
			false
		);
	} else if (fbillstatus == FBILLSTATUS.other) {
		//关闭
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group3,
				STOREREQ_CARD_BUTTON.Copy,
				STOREREQ_CARD_BUTTON.More,
				STOREREQ_CARD_BUTTON.Print,
				STOREREQ_CARD_BUTTON.PrintCountQuery,
				STOREREQ_CARD_BUTTON.Refresh,
				STOREREQ_CARD_BUTTON.AssistMenu,
				STOREREQ_CARD_BUTTON.ApproveInfo,
				STOREREQ_CARD_BUTTON.OnhandQuery,
				STOREREQ_CARD_BUTTON.OpenBill
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group1,
				STOREREQ_CARD_BUTTON.Edit,
				STOREREQ_CARD_BUTTON.Delete,
				STOREREQ_CARD_BUTTON.Commit,
				STOREREQ_CARD_BUTTON.Cancel,
				STOREREQ_CARD_BUTTON.Group2,
				STOREREQ_CARD_BUTTON.Material_PastLast,
				STOREREQ_CARD_BUTTON.BatchUpdate,
				STOREREQ_CARD_BUTTON.EditRowNum,
				STOREREQ_CARD_BUTTON.UnCommit,
				STOREREQ_CARD_BUTTON.CloseBill
			],
			false
		);
	} else {
		//提交
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group3,
				STOREREQ_CARD_BUTTON.Copy,
				STOREREQ_CARD_BUTTON.More,
				STOREREQ_CARD_BUTTON.Print,
				STOREREQ_CARD_BUTTON.PrintCountQuery,
				STOREREQ_CARD_BUTTON.Refresh,
				STOREREQ_CARD_BUTTON.OnhandQuery
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				STOREREQ_CARD_BUTTON.Group1,
				STOREREQ_CARD_BUTTON.Edit,
				STOREREQ_CARD_BUTTON.Delete,
				STOREREQ_CARD_BUTTON.Commit,
				STOREREQ_CARD_BUTTON.Cancel,
				STOREREQ_CARD_BUTTON.Group2,
				STOREREQ_CARD_BUTTON.Material_PastLast,
				STOREREQ_CARD_BUTTON.BatchUpdate,
				STOREREQ_CARD_BUTTON.EditRowNum,
				STOREREQ_CARD_BUTTON.UnCommit,
				STOREREQ_CARD_BUTTON.AssistMenu
			],
			false
		);
	}
}
/**
 * //1.优先根据界面状态判断显示按钮显示
	// 2.再根据单据状态控制按钮显示
 * @param {*} props 
 * @param {*} status 
 */
function setCardButtonVisiable(props, status, param) {
	if (param) {
		//审批中心使用
		this.props.button.setButtonVisible(
			[ STOREREQ_CARD_BUTTON.TemporaryStorage, STOREREQ_CARD_BUTTON.ShowDraft ],
			false
		);
		if (status === STOREREQ_CARD.browse) {
			//浏览态
			let fbillstatus = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.fbillstatus).value;
			if (fbillstatus == FBILLSTATUS.approve) {
				this.props.button.setButtonVisible(
					[
						STOREREQ_CARD_BUTTON.Edit,
						STOREREQ_CARD_BUTTON.File,
						STOREREQ_CARD_BUTTON.QueryAboutBusiness,
						STOREREQ_CARD_BUTTON.Print,
						STOREREQ_CARD_BUTTON.PrintCountQuery,
						STOREREQ_CARD_BUTTON.Refresh,
						STOREREQ_CARD_BUTTON.OnhandQuery
					],
					true
				);
				this.props.button.setButtonVisible(
					[
						STOREREQ_CARD_BUTTON.Save,
						STOREREQ_CARD_BUTTON.Cancel,
						STOREREQ_CARD_BUTTON.Group2,
						STOREREQ_CARD_BUTTON.Material_PastLast,
						STOREREQ_CARD_BUTTON.BatchUpdate,
						STOREREQ_CARD_BUTTON.EditRowNum
					],
					false
				);
			} else {
				this.props.button.setButtonVisible(
					[
						STOREREQ_CARD_BUTTON.File,
						STOREREQ_CARD_BUTTON.QueryAboutBusiness,
						STOREREQ_CARD_BUTTON.Print,
						STOREREQ_CARD_BUTTON.PrintCountQuery,
						STOREREQ_CARD_BUTTON.Refresh,
						STOREREQ_CARD_BUTTON.OnhandQuery
					],
					true
				);
				this.props.button.setButtonVisible(
					[
						STOREREQ_CARD_BUTTON.Edit,
						STOREREQ_CARD_BUTTON.Save,
						STOREREQ_CARD_BUTTON.Cancel,
						STOREREQ_CARD_BUTTON.Group2,
						STOREREQ_CARD_BUTTON.Material_PastLast,
						STOREREQ_CARD_BUTTON.BatchUpdate,
						STOREREQ_CARD_BUTTON.EditRowNum
					],
					false
				);
			}
		} else {
			//编辑态
			this.props.button.setButtonVisible(
				[
					STOREREQ_CARD_BUTTON.Save,
					STOREREQ_CARD_BUTTON.Cancel,
					STOREREQ_CARD_BUTTON.Group2,
					STOREREQ_CARD_BUTTON.EditRowNum,
					STOREREQ_CARD_BUTTON.OnhandQuery
				],
				true
			);
			this.props.button.setButtonVisible(
				[
					STOREREQ_CARD_BUTTON.Edit,
					STOREREQ_CARD_BUTTON.File,
					STOREREQ_CARD_BUTTON.QueryAboutBusiness,
					STOREREQ_CARD_BUTTON.Print,
					STOREREQ_CARD_BUTTON.PrintCountQuery,
					STOREREQ_CARD_BUTTON.Refresh,
					STOREREQ_CARD_BUTTON.Material_PastLast,
					STOREREQ_CARD_BUTTON.BatchUpdate
				],
				false
			);
		}
	} else {
		if (status === STOREREQ_CARD.browse) {
			//跳转浏览在pageInfoClick 中进行单独控制，保存后进行渲染走此处
			this.props.button.setButtonVisible(
				[
					STOREREQ_CARD_BUTTON.Group3,
					STOREREQ_CARD_BUTTON.Edit,
					STOREREQ_CARD_BUTTON.Delete,
					STOREREQ_CARD_BUTTON.Copy,
					STOREREQ_CARD_BUTTON.Commit,
					STOREREQ_CARD_BUTTON.AssistMenu,
					STOREREQ_CARD_BUTTON.File,
					STOREREQ_CARD_BUTTON.More,
					STOREREQ_CARD_BUTTON.Print,
					STOREREQ_CARD_BUTTON.PrintCountQuery,
					STOREREQ_CARD_BUTTON.ApproveInfo,
					STOREREQ_CARD_BUTTON.OnhandQuery,
					STOREREQ_CARD_BUTTON.Refresh,
					STOREREQ_CARD_BUTTON.ShowDraft
				],
				true
			);
			this.props.button.setButtonVisible(
				[
					STOREREQ_CARD_BUTTON.Group1,
					STOREREQ_CARD_BUTTON.Cancel,
					STOREREQ_CARD_BUTTON.Group2,
					STOREREQ_CARD_BUTTON.Material_PastLast,
					STOREREQ_CARD_BUTTON.BatchUpdate,
					STOREREQ_CARD_BUTTON.EditRowNum,
					STOREREQ_CARD_BUTTON.UnCommit,
					STOREREQ_CARD_BUTTON.Group7
				],
				false
			);
			if (this.PU_STOREREQ_TYPE == 'N') {
				this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true); //设置翻页显示
			}
		} else {
			//编辑态,新增
			this.props.button.setButtonVisible(
				[
					STOREREQ_CARD_BUTTON.Group1,
					STOREREQ_CARD_BUTTON.Cancel,
					STOREREQ_CARD_BUTTON.Group2,
					STOREREQ_CARD_BUTTON.OnhandQuery,
					STOREREQ_CARD_BUTTON.EditRowNum,
					STOREREQ_CARD_BUTTON.ShowDraft
				],
				true
			);
			this.props.button.setButtonVisible(
				[
					STOREREQ_CARD_BUTTON.Group3,
					STOREREQ_CARD_BUTTON.Commit,
					STOREREQ_CARD_BUTTON.More,
					STOREREQ_CARD_BUTTON.Print,
					STOREREQ_CARD_BUTTON.PrintCountQuery,
					STOREREQ_CARD_BUTTON.UnCommit,
					STOREREQ_CARD_BUTTON.ApproveInfo,
					STOREREQ_CARD_BUTTON.AssistMenu,
					STOREREQ_CARD_BUTTON.BatchUpdate,
					STOREREQ_CARD_BUTTON.Refresh,
					STOREREQ_CARD_BUTTON.Material_PastLast
				],
				false
			);

			//拉单标识
			let type = this.props.getUrlParam(STOREREQ_CARD.type);
			//如果是拉单或者推单页面进入 ，暂存按钮可见不可用
			if (type === STOREREQ_CARD.transfer) {
				this.props.button.setButtonVisible([ STOREREQ_CARD_BUTTON.ShowDraft ], false);
			}
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
			lineSelected.call(this, this.props);
			//新增时，执行光标聚焦
			if (status != STOREREQ_CARD.edit && status != STOREREQ_CARD.browse) {
				this.props.executeAutoFocus();
			}
		}
	}
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status
 */
function setUIState(props, status) {
	if (status === STOREREQ_CARD.browse) {
		this.props.form.setFormStatus(formId, status);
		this.props.cardTable.setStatus(tableId, status);
	} else {
		this.props.form.setFormStatus(formId, STOREREQ_CARD.edit);
		this.props.cardTable.setStatus(tableId, STOREREQ_CARD.edit);
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
	let fbillstatus = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.fbillstatus).value;
	let state = props.getUrlParam(STOREREQ_CARD.status);
	if (!state) {
		state = STOREREQ_CARD.add;
	}
	let bclose = record.values.bclose; //单据行状态
	if (bclose) {
		bclose = bclose.value;
	} else {
		bclose = false;
	}
	if (param) {
		let buttonAry = [];
		let openorclose = '';
		if (this.state.lineShowType[index] == 1) {
			openorclose = STOREREQ_CARD_BUTTON.CloseRow;
		} else {
			openorclose = STOREREQ_CARD_BUTTON.OpenRow;
		}
		if (state == STOREREQ_CARD.browse) {
			buttonAry = [ openorclose ];
		} else if ((state == STOREREQ_CARD.edit || state == STOREREQ_CARD.add) && this.copyRowDatas == null) {
			buttonAry = [ openorclose, STOREREQ_CARD_BUTTON.Delete_row, STOREREQ_CARD_BUTTON.InsertLine ];
		} else {
			buttonAry = [ STOREREQ_CARD_BUTTON.PasteThis ];
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
			openorclose = STOREREQ_CARD_BUTTON.CloseRow;
		} else {
			openorclose = STOREREQ_CARD_BUTTON.OpenRow;
		}
		if (state == STOREREQ_CARD.browse && fbillstatus == FBILLSTATUS.approved && bclose) {
			buttonAry = [ openorclose, STOREREQ_CARD_BUTTON.LineOpen ];
		} else if (state == STOREREQ_CARD.browse && fbillstatus == FBILLSTATUS.approved && !bclose) {
			buttonAry = [ openorclose, STOREREQ_CARD_BUTTON.LineClose ];
		} else if (state == STOREREQ_CARD.browse && fbillstatus == FBILLSTATUS.other) {
			buttonAry = [ openorclose, STOREREQ_CARD_BUTTON.LineOpen ];
		} else if (
			state == STOREREQ_CARD.browse &&
			(fbillstatus == FBILLSTATUS.free ||
				fbillstatus == FBILLSTATUS.approve ||
				fbillstatus == FBILLSTATUS.commit ||
				fbillstatus == FBILLSTATUS.unapproved)
		) {
			buttonAry = [ openorclose ];
		} else if ((state == STOREREQ_CARD.edit || state == STOREREQ_CARD.add) && this.copyRowDatas == null) {
			buttonAry = [ openorclose, STOREREQ_CARD_BUTTON.Delete_row, STOREREQ_CARD_BUTTON.InsertLine ];
		} else {
			buttonAry = [ STOREREQ_CARD_BUTTON.PasteThis ];
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
	let rowsdata = this.props.cardTable.getCheckedRows(STOREREQ_CARD.tableId);
	let rowsflag = true; //根据勾选行数控制肩部可用按钮
	let pk_org = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org);
	let hava_pkorg = true; //根据主组织控制增行的可用性
	let onhandflag = true; //控制存量查拣按钮可用性
	if (pk_org && pk_org.value && this.props.cardTable.getAllRows(STOREREQ_CARD.tableId).length) {
		onhandflag = false;
	} else if (this.props.getUrlParam(STOREREQ_CARD.status) == STOREREQ_CARD.browse) {
		onhandflag = false;
	}

	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	if (pk_org && pk_org.value) {
		hava_pkorg = false;
	}
	let disableArr = {
		[STOREREQ_CARD_BUTTON.AddLine]: hava_pkorg,
		[STOREREQ_CARD_BUTTON.DeleteLine]: rowsflag,
		[STOREREQ_CARD_BUTTON.CopyLine]: rowsflag,
		[STOREREQ_CARD_BUTTON.OnhandQuery]: onhandflag,
		[STOREREQ_CARD_BUTTON.EditRowNum]: hava_pkorg
	};
	this.props.button.setDisabled(disableArr);
}
function setSagaBtnState(status) {
	let sagaStatus = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.sagaStatus);
	// 第一次进入卡片页，frozen为空，取界面sags_statue的值判断冻结状态
	let frozen = sagaStatus && sagaStatus.value == '1' ? true : false;
	// 设置回退、重试按钮状态，用来是否显示
	if (status == STOREREQ_CARD.browse && frozen) {
		this.props.button.toggleErrorStatus(STOREREQ_CARD.formId, {
			isError: true
		});
	} else {
		this.props.button.toggleErrorStatus(STOREREQ_CARD.formId, {
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
