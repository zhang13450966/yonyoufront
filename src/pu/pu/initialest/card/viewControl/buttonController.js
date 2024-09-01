/*
 * @Author: zhaochyu
 * @PageInfo: 期初暂估单Card页面控制器
 * @Date: 2019-01-03 13:28:36
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-06-23 10:16:44
 */
import { PAGECODE, CARD_BUTTON, FIELD, FBILLSTATUS, DATASOURCE } from '../../constance';
import { AREA } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { UISTATE } from '../../../costfactor/constance';
let formId = PAGECODE.cardhead;
let tableId = PAGECODE.cardbody;
function setCardPaginationVisible(props, showPage) {
	// 设置卡片分页的显示隐藏
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', showPage);
}

/**
 * 设置返回按钮的可见性
 * @param {*} props
 */
function setBackButtonVisiable(props, param) {
	let status = props.getUrlParam(FIELD.cardStatus);
	if (!status) {
		status = STOREREQ_CARD.add;
	}
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
	this.props.button.setButtonVisible(
		[
			CARD_BUTTON.Edit,
			CARD_BUTTON.Delete,
			CARD_BUTTON.Copy,
			CARD_BUTTON.Refresh,
			CARD_BUTTON.Approve,
			CARD_BUTTON.BillTraceability,
			CARD_BUTTON.Print,
			CARD_BUTTON.Output,
			CARD_BUTTON.AttaMange
		],
		false
	);
}
/**
 * //1.设置浏览态显示按钮
 * @param {*} props
 * @param {*} fbillstatus
 */
function setBrowseButtonByStatus(props, fbillstatus) {
	let status = props.getUrlParam(FIELD.cardStatus);
	if (fbillstatus == FBILLSTATUS.free) {
		//自由
		this.props.button.setButtonVisible([ CARD_BUTTON.UnApprove ], false);
		this.props.button.setButtonVisible(
			[
				CARD_BUTTON.Add,
				CARD_BUTTON.Selfmake,
				CARD_BUTTON.Puorder,
				CARD_BUTTON.Edit,
				CARD_BUTTON.Delete,
				CARD_BUTTON.Copy,
				CARD_BUTTON.Refresh,
				CARD_BUTTON.Approve,
				CARD_BUTTON.More,
				CARD_BUTTON.BillTraceability,
				CARD_BUTTON.Print,
				CARD_BUTTON.Output
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				CARD_BUTTON.Save,
				CARD_BUTTON.Cancel,
				CARD_BUTTON.AddLine,
				CARD_BUTTON.DeleteLine,
				CARD_BUTTON.CopyLine,
				CARD_BUTTON.Renumber
			],
			false
		);
		this.props.button.setButtonVisible(
			[ CARD_BUTTON.Selfmake ],
			getDefData(DATASOURCE.dataSource, FIELD.isSelfMake)
		);
		this.props.button.setButtonVisible([ CARD_BUTTON.Puorder ], getDefData(DATASOURCE.dataSource, FIELD.isref21));
	} else if (fbillstatus == FBILLSTATUS.approved) {
		//审批通过
		this.props.button.setButtonVisible(
			[
				CARD_BUTTON.Add,
				CARD_BUTTON.Selfmake,
				CARD_BUTTON.Puorder,
				CARD_BUTTON.Copy,
				CARD_BUTTON.UnApprove,
				CARD_BUTTON.More,
				CARD_BUTTON.BillTraceability,
				CARD_BUTTON.Print,
				CARD_BUTTON.Output,
				CARD_BUTTON.Refresh
			],
			true
		);
		this.props.button.setButtonVisible([ CARD_BUTTON.Edit, CARD_BUTTON.Delete, CARD_BUTTON.Approve ], false);
		this.props.button.setButtonVisible(
			[ CARD_BUTTON.Selfmake ],
			getDefData(DATASOURCE.dataSource, FIELD.isSelfMake)
		);
		this.props.button.setButtonVisible([ CARD_BUTTON.Puorder ], getDefData(DATASOURCE.dataSource, FIELD.isref21));
	}
	//编辑态按钮
	props.button.setButtonVisible(
		[
			CARD_BUTTON.Save,
			CARD_BUTTON.Cancel,
			CARD_BUTTON.AddLine,
			CARD_BUTTON.DeleteLine,
			CARD_BUTTON.CopyLine,
			CARD_BUTTON.Renumber
		],
		false
	);
	//设置saga相关按钮状态
	setSagaBtnState.call(this, status);
}
/**
 * //1.设置编辑态按钮
 * @param {*} props
 * @param {*} status
 */
function setEditButtonByStatus(props, statusone) {
	let status = props.getUrlParam(FIELD.cardStatus);
	if (statusone == null) {
		statusone = this.props.getUrlParam(FIELD.cardStatus);
	}
	let flag = statusone == UISTATE.transfer ? true : false;
	this.props.button.setButtonVisible([ CARD_BUTTON.quitTransfer ], flag);
	//自由态按钮
	this.props.button.setButtonVisible(
		[
			CARD_BUTTON.Add,
			CARD_BUTTON.Selfmake,
			CARD_BUTTON.Edit,
			CARD_BUTTON.Delete,
			CARD_BUTTON.Copy,
			CARD_BUTTON.Refresh,
			CARD_BUTTON.Approve,
			CARD_BUTTON.More,
			CARD_BUTTON.BillTraceability,
			CARD_BUTTON.Print,
			CARD_BUTTON.Output
		],
		false
	);
	//审批已通过按钮
	this.props.button.setButtonVisible(
		[
			CARD_BUTTON.Add,
			CARD_BUTTON.Selfmake,
			CARD_BUTTON.Puorder,
			CARD_BUTTON.Copy,
			CARD_BUTTON.UnApprove,
			CARD_BUTTON.Print
		],
		false
	);
	//编辑态按钮
	props.button.setButtonVisible(
		[
			CARD_BUTTON.Save,
			CARD_BUTTON.Cancel,
			CARD_BUTTON.AddLine,
			CARD_BUTTON.DeleteLine,
			CARD_BUTTON.CopyLine,
			CARD_BUTTON.Renumber
		],
		true
	);
	props.button.setButtonVisible([ CARD_BUTTON.Pastetolast, CARD_BUTTON.Cancelcopyline ], false);
	//设置返回按钮false
	if (statusone == UISTATE.add) {
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false,
			showBillCode: true,
			billCode: ''
		});
	} else {
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false
		});
	}
	//设置saga相关按钮状态
	setSagaBtnState.call(this, status);
}
/**
 * //1.设置审批按钮可见性
 * @param {*} props
 * @param {*} status
 */
function setCardAproveButtonVisiable(transfer, isApprove) {
	if (transfer && isApprove) {
		this.props.button.setButtonVisible(
			[ CARD_BUTTON.Add, CARD_BUTTON.Edit, CARD_BUTTON.Delete, CARD_BUTTON.Approve ],
			false
		);
		this.props.button.setButtonVisible(
			[
				CARD_BUTTON.UnApprove,
				CARD_BUTTON.More,
				CARD_BUTTON.BillTraceability,
				CARD_BUTTON.Print,
				CARD_BUTTON.Output,
				CARD_BUTTON.Refresh
			],
			true
		);
	}
	if (!transfer && isApprove) {
		this.props.button.setButtonVisible([ CARD_BUTTON.Edit, CARD_BUTTON.Delete, CARD_BUTTON.Approve ], false);
		this.props.button.setButtonVisible(
			[
				CARD_BUTTON.Add,
				CARD_BUTTON.Copy,
				CARD_BUTTON.UnApprove,
				CARD_BUTTON.More,
				CARD_BUTTON.BillTraceability,
				CARD_BUTTON.Print,
				CARD_BUTTON.Output,
				CARD_BUTTON.Refresh
			],
			true
		);
		this.props.button.setButtonVisible(
			[ CARD_BUTTON.Selfmake ],
			getDefData(DATASOURCE.dataSource, FIELD.isSelfMake)
		);
		this.props.button.setButtonVisible([ CARD_BUTTON.Puorder ], getDefData(DATASOURCE.dataSource, FIELD.isref21));
	}
	if (transfer && !isApprove) {
		this.props.button.setButtonVisible([ CARD_BUTTON.UnApprove ], false);
		this.props.button.setButtonVisible(
			[
				CARD_BUTTON.Edit,
				CARD_BUTTON.Delete,
				CARD_BUTTON.Refresh,
				CARD_BUTTON.Approve,
				CARD_BUTTON.More,
				CARD_BUTTON.BillTraceability,
				CARD_BUTTON.Print,
				CARD_BUTTON.Output,
				CARD_BUTTON.quitTransfer
			],
			true
		);
	}
	if (!transfer && !isApprove) {
		this.props.button.setButtonVisible([ CARD_BUTTON.Selfmake, CARD_BUTTON.Puorder, CARD_BUTTON.UnApprove ], false);
		this.props.button.setButtonVisible(
			[
				CARD_BUTTON.Add,
				CARD_BUTTON.Edit,
				CARD_BUTTON.Delete,
				CARD_BUTTON.Copy,
				CARD_BUTTON.Refresh,
				CARD_BUTTON.Approve,
				CARD_BUTTON.More,
				CARD_BUTTON.BillTraceability,
				CARD_BUTTON.Print,
				CARD_BUTTON.Output
			],
			true
		);
		this.props.button.setButtonVisible(
			[ CARD_BUTTON.Selfmake ],
			getDefData(DATASOURCE.dataSource, FIELD.isSelfMake)
		);
		this.props.button.setButtonVisible([ CARD_BUTTON.Puorder ], getDefData(DATASOURCE.dataSource, FIELD.isref21));
	}
}
/**
 * //1.设置转单按钮的显示隐藏
 * @param {*} props
 * @param {*} status
 */
function setCardTransferButtonVisiable(status, fbillstatus) {
	let appflag = true;
	let flag = status == UISTATE.edit ? true : false;
	setUIState.call(this, this.props, status);
	if (fbillstatus == 3) {
		appflag = false;
		this.props.button.setButtonVisible(
			[
				CARD_BUTTON.UnApprove,
				CARD_BUTTON.More,
				CARD_BUTTON.BillTraceability,
				CARD_BUTTON.Print,
				CARD_BUTTON.Output,
				CARD_BUTTON.quitTransfer
			],
			!appflag
		);
	}
	if (fbillstatus == 0) {
		appflag = true;
		this.props.button.setButtonVisible(
			[ CARD_BUTTON.UnApprove, CARD_BUTTON.More, CARD_BUTTON.BillTraceability, CARD_BUTTON.quitTransfer ],
			!appflag
		);
	}
	this.props.button.setButtonVisible(
		[
			CARD_BUTTON.Edit,
			CARD_BUTTON.Delete,
			CARD_BUTTON.Approve,
			CARD_BUTTON.More,
			CARD_BUTTON.BillTraceability,
			CARD_BUTTON.Refresh,
			CARD_BUTTON.quitTransfer
		],
		!flag && appflag
	);
	this.props.button.setButtonVisible(
		[
			CARD_BUTTON.Save,
			CARD_BUTTON.Cancel,
			CARD_BUTTON.AddLine,
			CARD_BUTTON.DeleteLine,
			CARD_BUTTON.CopyLine,
			CARD_BUTTON.Renumber,
			CARD_BUTTON.quitTransfer
		],
		flag
	);
	this.props.button.setButtonVisible([ CARD_BUTTON.quitTransfer ], true);
	this.props.button.setButtonVisible(
		[ CARD_BUTTON.Add, CARD_BUTTON.Selfmake, CARD_BUTTON.Puorder, CARD_BUTTON.Copy ],
		false
	);
}
/**
 * //1.设置取消后按钮的显隐性
 * @param {*} props
 * @param {*} status
 */
function setCardCancelButtonVisiable(props) {
	props.button.setButtonVisible(
		[
			CARD_BUTTON.Edit,
			CARD_BUTTON.Delete,
			CARD_BUTTON.Copy,
			CARD_BUTTON.Refresh,
			CARD_BUTTON.Approve,
			CARD_BUTTON.BillTraceability,
			CARD_BUTTON.Print,
			CARD_BUTTON.Output
		],
		false
	);
	props.button.setButtonVisible(
		[
			CARD_BUTTON.Save,
			CARD_BUTTON.Cancel,
			CARD_BUTTON.AttaMange,
			CARD_BUTTON.AddLine,
			CARD_BUTTON.DeleteLine,
			CARD_BUTTON.CopyLine,
			CARD_BUTTON.Renumber
		],
		false
	);
	props.button.setButtonVisible([ CARD_BUTTON.Add, CARD_BUTTON.More ], true);
	props.button.setButtonVisible([ CARD_BUTTON.Selfmake ], getDefData(DATASOURCE.dataSource, FIELD.isSelfMake));
	props.button.setButtonVisible([ CARD_BUTTON.Puorder ], getDefData(DATASOURCE.dataSource, FIELD.isref21));
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status
 */
function setUIState(props, status) {
	if (status === UISTATE.browse) {
		props.form.setFormStatus(formId, status);
		props.cardTable.setStatus(tableId, status);
		// this.setState({ rechangeState: 'call' });
	} else {
		props.form.setFormStatus(formId, UISTATE.edit);
		props.cardTable.setStatus(tableId, UISTATE.edit);
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
function setRowButtons(props) {
	let buttonAry =
		props.cardTable.getStatus(PAGECODE.cardbody) === UISTATE.browse
			? [ CARD_BUTTON.Unfold ]
			: this.state.flag == 0
				? [ CARD_BUTTON.unfold, CARD_BUTTON.DeleteLine, CARD_BUTTON.copyLine, CARD_BUTTON.InsertLine ]
				: [ CARD_BUTTON.Pastehere ];
	return buttonAry;
}
/**
 * //设置肩上取消按钮的显隐形以及可用性
 * @param {*} props
 *
 */
function setRowCancelButton(props) {
	let disableArr = {
		[CARD_BUTTON.DeleteLine]: true,
		[CARD_BUTTON.CopyLine]: true
	};
	props.button.setDisabled(disableArr);
}
/**
 * //根据勾选行控制肩部按钮
 * @param {*} props
 *
 */
function lineSelected(props, flag) {
	let rows = null;
	let AddLine = null;
	let Renumber = null;
	let trueFlag = true;
	// 初始化全部不可见
	let CopyLine = trueFlag;
	let DeleteLine = trueFlag;
	if (props.cardTable.getCheckedRows(PAGECODE.cardbody)) {
		rows = props.cardTable.getCheckedRows(PAGECODE.cardbody);
		//选择数据时，区分一条或者多选  只有选择数据的时候才控制按钮
		if (rows.length >= 1) {
			rows.map((item) => {
				CopyLine = false;
				DeleteLine = false;
			});
		}
	}
	if (flag == true) {
		AddLine = true;
		Renumber = true;
	}
	let disableArr = {
		[CARD_BUTTON.CopyLine]: CopyLine,
		[CARD_BUTTON.DeleteLine]: DeleteLine,
		[CARD_BUTTON.AddLine]: AddLine,
		[CARD_BUTTON.Renumber]: Renumber
	}; //删除行，复制行
	props.button.setDisabled(disableArr);
}
/**
 * 设置卡片查询结果为空按钮
 * @param {*} props
 *
 */
function setCardBlankButtonVisiable(props) {
	props.button.setButtonVisible([ CARD_BUTTON.Copy, CARD_BUTTON.Edit, CARD_BUTTON.Delete ], false);
	props.button.setButtonVisible([ CARD_BUTTON.Add, CARD_BUTTON.More ], true);
	props.button.setButtonVisible([ CARD_BUTTON.Selfmake ], getDefData(DATASOURCE.dataSource, FIELD.isSelfMake));
	props.button.setButtonVisible([ CARD_BUTTON.Puorder ], getDefData(DATASOURCE.dataSource, FIELD.isref21));
	props.button.setButtonVisible(
		[
			CARD_BUTTON.Save,
			CARD_BUTTON.Cancel,
			CARD_BUTTON.AttaMange,
			CARD_BUTTON.AddLine,
			CARD_BUTTON.DeleteLine,
			CARD_BUTTON.CopyLine,
			CARD_BUTTON.Renumber
		],
		false
	);
}
function setSagaBtnState(status) {
	let sagaStatus = this.props.form.getFormItemsValue([ AREA.cardFormArea ], FIELD.sagaStatus); //获得saga状态 // 第一次进入卡片页，frozen为空，取界面sags_statue的值判断冻结状态
	let frozen = sagaStatus && sagaStatus.value == '1' ? true : false;
	// 设置回退、重试按钮状态，用来是否显示
	if (status == UISTATE.browse && frozen) {
		this.props.button.toggleErrorStatus(AREA.cardFormArea, {
			isError: true
		});
	} else {
		this.props.button.toggleErrorStatus(AREA.cardFormArea, {
			isError: false
		});
	}
}
export default {
	setRowButtons,
	setCardPaginationVisible,
	setUIState,
	setBackButtonVisiable,
	setBrowseButtonByStatus,
	setEditButtonByStatus,
	setCardAproveButtonVisiable,
	setCardTransferButtonVisiable,
	setCardCancelButtonVisiable,
	setCardBlankButtonVisiable,
	setBlankPageButtons,
	setRowCancelButton,
	lineSelected
};
