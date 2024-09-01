/*
 * @Author: chaiwx 
 * @PageInfo: 卡片状态切换  
 * @Date: 2018-04-11 17:51:33 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-09-17 16:32:02
 */
import { AREA, BUTTONID, FIELDS, BILLSTATUS } from '../../constance';

function buttonControl(props, billStatus, pageStatus, ncollectnum) {
	// 初始化控制参数
	let { params } = initParams.call(this, props, pageStatus, billStatus, ncollectnum);
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
	//正常按钮控制
	normalOp(props, params);

	if (params.option == 'transfer') {
		// 转单
		transferControl(props);
	} else if (params.status === 'browse' && !params.id) {
		// 空白页面
		blankPageControl(props);
	}
}

/**
 * 转单
 * @param {*} props 
 */
function transferControl(props) {
	props.button.setButtonVisible([ BUTTONID.Quit ], true);
	props.button.setButtonVisible([ BUTTONID.Add ], false);
}
/**
 * 空白页面
 * @param {*} props 
 */
function blankPageControl(props) {
	props.button.setButtonVisible(
		[
			BUTTONID.Edit,
			BUTTONID.Delete,
			BUTTONID.Send,
			BUTTONID.UnSend,
			BUTTONID.Confirm,
			BUTTONID.UnConfirm,
			BUTTONID.Print,
			BUTTONID.Output,
			BUTTONID.BillLinkQuery,
			BUTTONID.LinkQueryInvoice,
			BUTTONID.Attachment,
			BUTTONID.Refresh,
			BUTTONID.AddLine,
			BUTTONID.DeleteLine,
			BUTTONID.ResetRowNo,
			BUTTONID.Cancel
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
function initParams(props, pageStatus, billStatus, ncollectnum) {
	let id = props.getUrlParam('id');
	let status = props.getUrlParam('status');
	let option = props.getUrlParam('option');
	status = pageStatus ? pageStatus : status;
	let params = {
		status: status,
		billStatus: billStatus,
		ncollectnum: ncollectnum,
		flag: status === 'browse' ? false : true,
		id: id,
		option: option
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
			BUTTONID.Edit,
			BUTTONID.Delete,
			BUTTONID.Send,
			BUTTONID.UnSend,
			BUTTONID.Confirm,
			BUTTONID.UnConfirm,
			BUTTONID.Attachment,
			BUTTONID.BillLinkQuery,
			BUTTONID.LinkQueryInvoice,
			BUTTONID.Print,
			BUTTONID.Output,
			BUTTONID.Refresh
		],
		!params.flag
	);
	props.button.setButtonVisible([ BUTTONID.Save, BUTTONID.Cancel ], params.flag);
	props.button.setButtonVisible([ BUTTONID.Quit ], false);
	if (params.flag) {
		props.button.setDisabled({
			[BUTTONID.SelPrice]: true,
			[BUTTONID.DeleteLine]: true
		});
		if (params.status == 'edit') {
			props.button.setDisabled({
				[BUTTONID.AddLine]: false
			});
		}
	} else {
		// 辅助功能根据单据状态设置按钮可见性
		if (params.billStatus) {
			if (params.billStatus == BILLSTATUS.free) {
				props.button.setButtonVisible([ BUTTONID.UnSend, BUTTONID.UnConfirm, BUTTONID.Invoice ], false);
			} else if (params.billStatus == BILLSTATUS.send) {
				props.button.setButtonVisible(
					[ BUTTONID.Edit, BUTTONID.Delete, BUTTONID.Send, BUTTONID.UnConfirm, BUTTONID.Invoice ],
					false
				);
			} else if (params.billStatus == BILLSTATUS.confirm) {
				props.button.setButtonVisible(
					[ BUTTONID.Edit, BUTTONID.Delete, BUTTONID.Send, BUTTONID.UnSend, BUTTONID.Confirm ],
					false
				);
				props.button.setButtonVisible([ BUTTONID.Invoice ], true);
			}
		}
		//累计主数量不为0 显示联查发票
		if (params.ncollectnum) {
			if (params.ncollectnum == 0) {
				props.button.setButtonVisible([ BUTTONID.LinkQueryInvoice ], false);
			} else {
				props.button.setButtonVisible([ BUTTONID.LinkQueryInvoice ], true);
			}
		}
	}

	// 表体
	props.button.setButtonVisible([ BUTTONID.SelPrice, BUTTONID.DeleteLine, BUTTONID.ResetRowNo ], params.flag);
}

/**
 * 表头信息处理（返回，单据号，翻页）
 * @param {*} params 
 */
function headInfoOp(props, params) {
	let isBackBtnEnable = true;
	let isPageBtnEnable = true;

	// 返回按钮控制
	// 浏览态才会有
	// 其他情况，显示
	if (params.option != 'transfer' && params.flag) {
		isBackBtnEnable = false;
	}

	// 卡片翻页按钮控制
	// 0.浏览态才会有
	// 1.空白页面永远不显示
	// 2.其他情况，显示
	if (params.flag || !params.id || params.id == '') {
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
				[BUTTONID.DeleteLine]: true,
				[BUTTONID.SelPrice]: true,
				[BUTTONID.Invoice]: true
			});
		} else {
			this.props.button.setDisabled({
				[BUTTONID.DeleteLine]: false,
				[BUTTONID.SelPrice]: false,
				[BUTTONID.Invoice]: false
			});
		}
	}
}

export { buttonControl, onRowsSelected };
