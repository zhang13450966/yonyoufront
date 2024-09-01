/*
 * @Author: chaiwx 
 * @PageInfo: 卡片状态切换  
 * @Date: 2018-04-11 17:51:33 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-23 12:04:26
 */
import { AREA, BUTTONID, FIELDS, BILLSTATUS } from '../../constance';

function buttonControl(props, billStatus, pageStatus) {
	// 初始化控制参数
	let { params } = initParams.call(this, props, pageStatus, billStatus);
	// 表头信息控制
	headInfoOp.call(this, props, params);
	// 主要控制
	mainControl.call(this, props, params);
	// 设置页面状态
	setPageStatus(props, params);
	// 执行光标聚焦
	props.executeAutoFocus();
}

/**
 * 主要控制
 * @param {*} props 
 * @param {*} params 
 */
function mainControl(props, params) {
	if (params.scene == 'approvesce') {
		// 审批中心
		approveCenterOp(props, params.flag);
	} else {
		// 普通情况按钮控制
		normalOp(props, params);

		if (params.status === 'browse' && !params.id) {
			// 空白页面
			blankPageControl(props);
		}
	}
}

/**
 * 空白页面
 * @param {*} props 
 */
function blankPageControl(props) {
	props.button.setButtonVisible(
		[
			BUTTONID.Copy,
			BUTTONID.Edit,
			BUTTONID.Delete,
			BUTTONID.Commit,
			BUTTONID.UnCommit,
			BUTTONID.ApproveInfo,
			BUTTONID.Print,
			BUTTONID.Output,
			BUTTONID.BillClose,
			BUTTONID.BillOpen,
			BUTTONID.LinkQuery,
			BUTTONID.File,
			BUTTONID.BillLinkQuery,
			BUTTONID.LinkQueryVoucher,
			BUTTONID.LinkQueryBudget,
			BUTTONID.Refresh,
			BUTTONID.AddFeeLine,
			BUTTONID.AddMatLine,
			BUTTONID.DeleteMatLine,
			BUTTONID.DeleteFeeLine,
			BUTTONID.CopyLine,
			BUTTONID.ReArrangeRowNo,
			BUTTONID.PasteLineToTail,
			BUTTONID.CancelB
		],
		false
	);
}

/** 
 * 设置页面状态
 * @param {*} props 
 */
function setPageStatus(props, params) {
	props.form.setFormStatus(AREA.cardFormId, params.status);
	props.cardTable.setStatus(AREA.cardTableId, params.status == 'add' ? 'edit' : params.status);
}

/**
 * 参数较多，封装未对象
 * @param {*} props 
 * @param {*} pageStatus 
 * @param {*} billStatus 
 */
function initParams(props, pageStatus, billStatus) {
	let status = pageStatus ? pageStatus : props.getUrlParam('status');
	let params = {
		status: status,
		billStatus: billStatus,
		flag: status === 'browse' ? false : true,
		id: props.getUrlParam('id'),
		option: props.getUrlParam('option'),
		scene: props.getUrlParam('scene')
	};
	return { params, status };
}

/**
 * 通用控制
 * @param {*} props 
 * @param {*} params 
 */
function normalOp(props, params) {
	props.button.setButtonVisible(
		[
			BUTTONID.Add,
			BUTTONID.Copy,
			BUTTONID.Edit,
			BUTTONID.Delete,
			BUTTONID.Commit,
			BUTTONID.UnCommit,
			BUTTONID.ApproveInfo,
			BUTTONID.Print,
			BUTTONID.Output,
			BUTTONID.BillClose,
			BUTTONID.BillOpen,
			BUTTONID.LinkQuery,
			BUTTONID.File,
			BUTTONID.BillLinkQuery,
			BUTTONID.LinkQueryVoucher,
			BUTTONID.LinkQueryBudget,
			BUTTONID.Refresh
		],
		!params.flag
	);
	props.button.setButtonVisible([ BUTTONID.Save, BUTTONID.SaveCommit, BUTTONID.Cancel ], params.flag);
	props.button.setButtonVisible([ BUTTONID.Quit ], false);

	if (params.flag) {
		props.button.setDisabled({
			[BUTTONID.DeleteFeeLine]: true,
			[BUTTONID.DeleteMatLine]: true
		});
		if (params.status == 'edit') {
			props.button.setDisabled({
				[BUTTONID.AddFeeLine]: false,
				[BUTTONID.AddMatLine]: false
			});
		}
	} else {
		// 辅助功能根据单据状态设置按钮可见性
		if (params.billStatus) {
			if (params.billStatus == BILLSTATUS.free) {
				props.button.setButtonVisible([ BUTTONID.UnCommit, BUTTONID.BillClose, BUTTONID.BillOpen ], false);
			} else if (params.billStatus == BILLSTATUS.nopass) {
				props.button.setButtonVisible([ BUTTONID.UnCommit, BUTTONID.BillClose, BUTTONID.BillOpen ], false);
			} else if (params.billStatus == BILLSTATUS.auditing) {
				props.button.setButtonVisible(
					[ BUTTONID.Edit, BUTTONID.Delete, BUTTONID.Commit, BUTTONID.BillClose, BUTTONID.BillOpen ],
					false
				);
			} else if (params.billStatus == BILLSTATUS.audit) {
				props.button.setButtonVisible(
					[ BUTTONID.BillOpen, BUTTONID.Edit, BUTTONID.Delete, BUTTONID.Commit ],
					false
				);
			} else if (params.billStatus == BILLSTATUS.freeze) {
				props.button.setButtonVisible(
					[
						BUTTONID.Edit,
						BUTTONID.Delete,
						BUTTONID.Commit,
						BUTTONID.UnCommit,
						BUTTONID.BillClose,
						BUTTONID.BillOpen
					],
					false
				);
			} else if (params.billStatus == BILLSTATUS.close) {
				props.button.setButtonVisible(
					[
						BUTTONID.Edit,
						BUTTONID.Delete,
						BUTTONID.Commit,
						BUTTONID.BillClose,
						BUTTONID.FillInv,
						BUTTONID.SendInv,
						BUTTONID.Freeze,
						BUTTONID.UnFreeze
					],
					false
				);
			}
		}
	}

	// 表体
	props.button.setButtonVisible([ BUTTONID.PasteLineToTail, BUTTONID.CancelB ], false);
	props.button.setButtonVisible(
		[
			BUTTONID.AddFeeLine,
			BUTTONID.AddMatLine,
			BUTTONID.DeleteFeeLine,
			BUTTONID.DeleteMatLine,
			BUTTONID.CopyLine,
			BUTTONID.ReArrangeRowNo
		],
		params.flag
	);
}

/**
 * 审批中心按钮控制
 * @param {*} props 
 * @param {*} flag 
 */
function approveCenterOp(props, flag) {
	let fstatusflag = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.fstatusflag).value;
	// 表头
	// 永不显示
	props.button.setButtonVisible(
		[
			BUTTONID.Add,
			BUTTONID.SaveCommit,
			BUTTONID.Copy,
			BUTTONID.Delete,
			BUTTONID.Commit,
			BUTTONID.UnCommit,
			BUTTONID.ApproveInfo,
			BUTTONID.BillClose,
			BUTTONID.BillOpen,
			BUTTONID.LineClose,
			BUTTONID.LineOpen
		],
		false
	);

	props.button.setButtonVisible(
		[
			BUTTONID.Edit,
			BUTTONID.Print,
			BUTTONID.Output,
			BUTTONID.File,
			BUTTONID.BillLinkQuery,
			BUTTONID.LinkQueryVoucher,
			BUTTONID.LinkQueryBudget,
			BUTTONID.Refresh
		],
		!flag
	);
	if (fstatusflag != BILLSTATUS.auditing) {
		props.button.setButtonVisible([ BUTTONID.Edit ], false);
	}
	props.button.setButtonVisible([ BUTTONID.Save, BUTTONID.Cancel ], flag);
	// 表体
	props.button.setButtonVisible([ BUTTONID.CancelB ], false);
	props.button.setButtonVisible(
		[ BUTTONID.AddFeeLine, BUTTONID.AddMatLine, BUTTONID.DeleteFeeLine, BUTTONID.DeleteMatLine ],
		flag
	);
	props.button.setDisabled({
		[BUTTONID.DeleteFeeLine]: true,
		[BUTTONID.DeleteMatLine]: true
	});
}

/**
 * 表头信息处理（返回，单据号，翻页）
 * @param {*} params 
 */
function headInfoOp(props, params) {
	let isBackBtnEnable = true;
	let isPageBtnEnable = true;

	// 返回按钮控制
	// 0.浏览态才会有
	// 1.审批中心永远不显示
	// 2.其他情况，显示
	if (params.flag || props.getUrlParam('scene') == 'approvesce') {
		isBackBtnEnable = false;
	}
	// 卡片翻页按钮控制
	// 0.浏览态才会有
	// 1.空白页面、审批中心永远不显示
	// 2.其他情况，显示
	if (
		params.flag ||
		!props.getUrlParam('id') ||
		props.getUrlParam('id') == '' ||
		props.getUrlParam('scene') == 'approvesce'
	) {
		isPageBtnEnable = false;
	}
	props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: isBackBtnEnable,
		showBillCode: true,
		billCode: props.form.getFormItemsValue([ AREA.cardFormId ], FIELDS.vbillcode).value //修改单据号---非必传
	});
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', isPageBtnEnable);
}

/**
 * 批量操作需要判断是否选中行，未选中的时候不可点击
 */
function onRowsSelected() {
	if (this.props.cardTable.getNumberOfRows(AREA.cardTableId) > 0) {
		let checkArr = this.props.cardTable.getCheckedRows(AREA.cardTableId);
		if (!checkArr || checkArr.length < 1) {
			this.props.button.setDisabled({
				[BUTTONID.DeleteFeeLine]: true,
				[BUTTONID.DeleteMatLine]: true
			});
		} else {
			this.props.button.setDisabled({
				[BUTTONID.DeleteMatLine]: false,
				[BUTTONID.DeleteFeeLine]: false
			});
		}
	}
}

export { buttonControl, onRowsSelected };
