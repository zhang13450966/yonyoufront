/*
 * @Author: zhangchqf 
 * @PageInfo: card页控制器
 * @Date: 2020-02-25 13:30:43 
 * @Last Modified by: wangpju
 * @Last Modified time: 2021-05-25 10:56:02
 */

import { TARGETADJ_CARD, ATTRCODE, TARGETADJ_CARD_BUTTON, FBILLSTATUS } from '../../siconst';
let headf = TARGETADJ_CARD.headf;
let formId = TARGETADJ_CARD.formId;
let tableId = TARGETADJ_CARD.tableId;
function setCardPaginationVisible(props, showPage) {
	// 设置卡片分页的显示隐藏
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', showPage);
}

/**
 * 设置返回按钮的可见性
 * @param {*} props
 */
function setBackButtonVisiable(props, parentURL) {
	let status = this.props.getUrlParam(TARGETADJ_CARD.status);
	//推单标识
	let channelType = this.props.getUrlParam(TARGETADJ_CARD.channelType);
	let type = this.props.getUrlParam(TARGETADJ_CARD.type);
	//如果是拉单或者推单页面进入 ，则显示退出转单按钮
	if (type === TARGETADJ_CARD.transfer || channelType) {
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.state.vbillcode //修改单据号---非必传
		});
		setSagaBtnState.call(this, TARGETADJ_CARD.browse);
	} else {
		//单据是浏览态
		if (status === TARGETADJ_CARD.browse) {
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
			if (status === TARGETADJ_CARD.add) {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: '' //修改单据号---非必传
				});
			} else if (status == TARGETADJ_CARD.edit) {
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
 * @param {*} fstatusflag 
 */
function setBlankPageButtons() {
	this.props.button.setButtonVisible([TARGETADJ_CARD_BUTTON.Adds], true);
	this.props.button.setButtonVisible(
		[
			TARGETADJ_CARD_BUTTON.Add,
			TARGETADJ_CARD_BUTTON.Edit,
			TARGETADJ_CARD_BUTTON.Delete,
			TARGETADJ_CARD_BUTTON.File,
			TARGETADJ_CARD_BUTTON.Commit,
			TARGETADJ_CARD_BUTTON.Cancel,
			TARGETADJ_CARD_BUTTON.Group2,
			TARGETADJ_CARD_BUTTON.Group1,
			TARGETADJ_CARD_BUTTON.UnCommit,
			TARGETADJ_CARD_BUTTON.ApproveInfo,
			TARGETADJ_CARD_BUTTON.More,
			TARGETADJ_CARD_BUTTON.Refresh
		],
		false
	);
}
/**
 * //1.再根据单据状态控制按钮显示
 * @param {*} props 
 * @param {*} fstatusflag 
 */
function setBrowseButtonByStatus(props, fstatusflag) {
	if (fstatusflag == FBILLSTATUS.free) {
		//自由
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Group3,
				TARGETADJ_CARD_BUTTON.Edit,
				TARGETADJ_CARD_BUTTON.Delete,
				TARGETADJ_CARD_BUTTON.Commit,
				TARGETADJ_CARD_BUTTON.More,
				TARGETADJ_CARD_BUTTON.File,
				TARGETADJ_CARD_BUTTON.ApproveInfo,
				TARGETADJ_CARD_BUTTON.Refresh
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Group1,
				TARGETADJ_CARD_BUTTON.Cancel,
				TARGETADJ_CARD_BUTTON.Group2,
				TARGETADJ_CARD_BUTTON.UnCommit
			],
			false
		);
	} else if (fstatusflag == FBILLSTATUS.unapproved) {
		//审批不通过
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Group3,
				TARGETADJ_CARD_BUTTON.Edit,
				TARGETADJ_CARD_BUTTON.Delete,
				TARGETADJ_CARD_BUTTON.More,
				TARGETADJ_CARD_BUTTON.File,
				TARGETADJ_CARD_BUTTON.Refresh,
				TARGETADJ_CARD_BUTTON.ApproveInfo
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Commit,
				TARGETADJ_CARD_BUTTON.Group1,
				TARGETADJ_CARD_BUTTON.Cancel,
				TARGETADJ_CARD_BUTTON.Group2,
				TARGETADJ_CARD_BUTTON.UnCommit
			],
			false
		);
	} else if (fstatusflag == FBILLSTATUS.approve) {
		//审批中
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Group3,
				TARGETADJ_CARD_BUTTON.UnCommit,
				TARGETADJ_CARD_BUTTON.ApproveInfo,
				TARGETADJ_CARD_BUTTON.More,
				TARGETADJ_CARD_BUTTON.File,
				TARGETADJ_CARD_BUTTON.Refresh
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Group1,
				TARGETADJ_CARD_BUTTON.Edit,
				TARGETADJ_CARD_BUTTON.Delete,
				TARGETADJ_CARD_BUTTON.Commit,
				TARGETADJ_CARD_BUTTON.Cancel,
				TARGETADJ_CARD_BUTTON.Group2
			],
			false
		);
	} else if (fstatusflag == FBILLSTATUS.approved) {
		//执行中，审批通过
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Group3,
				TARGETADJ_CARD_BUTTON.UnCommit,
				TARGETADJ_CARD_BUTTON.ApproveInfo,
				TARGETADJ_CARD_BUTTON.More,
				TARGETADJ_CARD_BUTTON.File,
				TARGETADJ_CARD_BUTTON.Refresh
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Group1,
				TARGETADJ_CARD_BUTTON.Edit,
				TARGETADJ_CARD_BUTTON.Delete,
				TARGETADJ_CARD_BUTTON.Commit,
				TARGETADJ_CARD_BUTTON.Cancel,
				TARGETADJ_CARD_BUTTON.Group2
			],
			false
		);
	} else if (fstatusflag == FBILLSTATUS.other) {
		//关闭
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Group3,
				TARGETADJ_CARD_BUTTON.ApproveInfo,
				TARGETADJ_CARD_BUTTON.More,
				TARGETADJ_CARD_BUTTON.File,
				TARGETADJ_CARD_BUTTON.Refresh
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Group1,
				TARGETADJ_CARD_BUTTON.Edit,
				TARGETADJ_CARD_BUTTON.Delete,
				TARGETADJ_CARD_BUTTON.Commit,
				TARGETADJ_CARD_BUTTON.Cancel,
				TARGETADJ_CARD_BUTTON.Group2,
				TARGETADJ_CARD_BUTTON.UnCommit
			],
			false
		);
	} else {
		//提交
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Group3,
				TARGETADJ_CARD_BUTTON.More,
				TARGETADJ_CARD_BUTTON.File,
				TARGETADJ_CARD_BUTTON.Refresh
			],
			true
		);
		this.props.button.setButtonVisible(
			[
				TARGETADJ_CARD_BUTTON.Group1,
				TARGETADJ_CARD_BUTTON.Edit,
				TARGETADJ_CARD_BUTTON.Delete,
				TARGETADJ_CARD_BUTTON.Commit,
				TARGETADJ_CARD_BUTTON.Cancel,
				TARGETADJ_CARD_BUTTON.Group2,
				TARGETADJ_CARD_BUTTON.UnCommit,
				TARGETADJ_CARD_BUTTON.ApproveInfo
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
 * @param {*} param 判断是否从审批中心进入
 */
function setCardButtonVisiable(props, status, param) {
	if (param) {
		//审批中心使用
		let fstatusflag = this.props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.fstatusflag).value;
		if (status === TARGETADJ_CARD.browse) {
			//浏览态
			if (fstatusflag == FBILLSTATUS.approved) {
				this.props.button.setButtonVisible(
					[
						TARGETADJ_CARD_BUTTON.File,
						TARGETADJ_CARD_BUTTON.QueryAboutBusiness,
						TARGETADJ_CARD_BUTTON.Refresh
					],
					true
				);
				this.props.button.setButtonVisible(
					[
						TARGETADJ_CARD_BUTTON.Group1,
						TARGETADJ_CARD_BUTTON.Save,
						TARGETADJ_CARD_BUTTON.Cancel,
						TARGETADJ_CARD_BUTTON.Group2
					],
					false
				);
			} else {
				this.props.button.setButtonVisible(
					[
						TARGETADJ_CARD_BUTTON.Edit,
						TARGETADJ_CARD_BUTTON.File,
						TARGETADJ_CARD_BUTTON.QueryAboutBusiness,
						TARGETADJ_CARD_BUTTON.Refresh
					],
					true
				);
				this.props.button.setButtonVisible(
					[TARGETADJ_CARD_BUTTON.Save, TARGETADJ_CARD_BUTTON.Cancel, TARGETADJ_CARD_BUTTON.Group2],
					false
				);
			}
		} else if (status === TARGETADJ_CARD.edit || status === TARGETADJ_CARD.add) {
			//编辑态
			this.props.button.setButtonVisible(
				[TARGETADJ_CARD_BUTTON.Save, TARGETADJ_CARD_BUTTON.Cancel, TARGETADJ_CARD_BUTTON.Group2],
				true
			);
			this.props.button.setButtonVisible(
				[
					TARGETADJ_CARD_BUTTON.Edit,
					TARGETADJ_CARD_BUTTON.File,
					TARGETADJ_CARD_BUTTON.QueryAboutBusiness,
					TARGETADJ_CARD_BUTTON.Refresh,
					TARGETADJ_CARD_BUTTON.SaveCommit
				],
				false
			);
		} else {
			setBlankPageButtons.call(this);
			setCardPaginationVisible.call(this, props, false);
		}
	} else {
		//卡片页使用
		if (status === TARGETADJ_CARD.browse) {
			//跳转浏览在pageInfoClick 中进行单独控制，保存后进行渲染走此处
			//自由
			this.props.button.setButtonVisible(
				[
					TARGETADJ_CARD_BUTTON.Group3,
					TARGETADJ_CARD_BUTTON.Edit,
					TARGETADJ_CARD_BUTTON.Delete,
					TARGETADJ_CARD_BUTTON.Commit,
					TARGETADJ_CARD_BUTTON.More,
					TARGETADJ_CARD_BUTTON.File,
					TARGETADJ_CARD_BUTTON.Refresh,
					TARGETADJ_CARD_BUTTON.ApproveInfo
				],
				true
			);
			this.props.button.setButtonVisible(
				[
					TARGETADJ_CARD_BUTTON.Group1,
					TARGETADJ_CARD_BUTTON.Cancel,
					TARGETADJ_CARD_BUTTON.Group2,
					TARGETADJ_CARD_BUTTON.UnCommit
				],
				false
			);
			//如果想要浏览态物料维度，期间不可修改，在这里可以设定
			//this.props.form.setDisabled();
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true); //设置翻页显示
		} else if (status === TARGETADJ_CARD.edit || status === TARGETADJ_CARD.add) {
			//编辑态,新增
			this.props.button.setButtonVisible(
				[
					TARGETADJ_CARD_BUTTON.Group1,
					TARGETADJ_CARD_BUTTON.SaveCommit,
					TARGETADJ_CARD_BUTTON.Cancel,
					TARGETADJ_CARD_BUTTON.Group2
				],
				true
			);
			this.props.button.setButtonVisible(
				[
					TARGETADJ_CARD_BUTTON.Group3,
					TARGETADJ_CARD_BUTTON.Commit,
					TARGETADJ_CARD_BUTTON.UnCommit,
					TARGETADJ_CARD_BUTTON.More,
					TARGETADJ_CARD_BUTTON.File,
					TARGETADJ_CARD_BUTTON.ApproveInfo,
					TARGETADJ_CARD_BUTTON.Refresh
				],
				false
			);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
			lineSelected.call(this, this.props);
			//新增时，执行光标聚焦
			if (status != TARGETADJ_CARD.edit && status != TARGETADJ_CARD.browse) {
				this.props.executeAutoFocus();
			}
		} else {
			setBlankPageButtons.call(this);
			setCardPaginationVisible.call(this, props, false);
		}
	}
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status
 */
function setUIState(props, status) {
	// this.props.form.setFormStatus(headf, TARGETADJ_CARD.edit); //不知道为啥这个地方给复成编辑态，暂时先改
	if (status === TARGETADJ_CARD.browse) {
		this.props.form.setFormStatus(headf, status);
		this.props.form.setFormStatus(formId, status);
		this.props.cardTable.setStatus(tableId, status);
	} else {
		this.props.form.setFormStatus(formId, TARGETADJ_CARD.edit);
		this.props.form.setFormStatus(TARGETADJ_CARD.headf, TARGETADJ_CARD.edit);
		this.props.cardTable.setStatus(tableId, TARGETADJ_CARD.edit);
	}
	this.props.form.setFormItemsDisabled(headf, { [ATTRCODE.cmarsetid]: false, [ATTRCODE.vperiod]: false });
}

/**
 * 对form中指定字段进行状态设置，需要指定改变状态的字段（平台对于form的处理，在浏览态是不能单独制定某个字段的编辑性的）
 * @param {string} status 状态字段，browse/edit
 * @param {array} include 排除影响的字段
 */
function setFormStatus(status, include) {
	// 1. form需要永远是编辑态
	this.props.form.setFormStatus(headf, TARGETADJ_CARD.edit);
	// 2. 对所有include状态字段进行状态改变
	let disabled = true;
	if (TARGETADJ_CARD.browse == status) {
		disabled = true;
	} else {
		disabled = false;
	}
	let disabledFields = {};
	for (const field of include) {
		disabledFields[field] = disabled;
	}
	this.props.form.setFormItemsDisabled(headf, disabledFields);
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
	let fstatusflag = props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.fstatusflag).value;
	let bclose = record.values.browclose; //单据行状态
	if (bclose) {
		bclose = bclose.value;
	} else {
		bclose = false;
	}
	let state = props.getUrlParam(TARGETADJ_CARD.status);
	//推单
	let channelType = props.getUrlParam(TARGETADJ_CARD.channelType);
	//拉单
	let transfer = props.getUrlParam(TARGETADJ_CARD.type);
	if (channelType || transfer) {
		//拉单或者推单时，状态使用 this.state.status
		state = this.state.status;
	}
	if (param) {
		let buttonAry = [];
		let openorclose = '';
		if (this.state.lineShowType[index] == 1) {
			openorclose = TARGETADJ_CARD_BUTTON.CloseRow;
		} else {
			openorclose = TARGETADJ_CARD_BUTTON.OpenRow;
		}
		if (state == TARGETADJ_CARD.browse) {
			buttonAry = [openorclose];
		} else if ((state == TARGETADJ_CARD.edit || state == TARGETADJ_CARD.add) && this.state.copyRowDatas == null) {
			buttonAry = [openorclose, TARGETADJ_CARD_BUTTON.Delete_row, TARGETADJ_CARD_BUTTON.InsertLine];
		} else {
			buttonAry = [TARGETADJ_CARD_BUTTON.PasteThis];
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
			openorclose = TARGETADJ_CARD_BUTTON.CloseRow;
		} else {
			openorclose = TARGETADJ_CARD_BUTTON.OpenRow;
		}
		if (state == TARGETADJ_CARD.browse && fstatusflag == FBILLSTATUS.approved && bclose) {
			buttonAry = [openorclose, TARGETADJ_CARD_BUTTON.LineOpen];
		} else if (state == TARGETADJ_CARD.browse && fstatusflag == FBILLSTATUS.approved && !bclose) {
			buttonAry = [openorclose, TARGETADJ_CARD_BUTTON.LineClose];
		} else if (state == TARGETADJ_CARD.browse && fstatusflag == FBILLSTATUS.other) {
			buttonAry = [openorclose, TARGETADJ_CARD_BUTTON.LineOpen];
		} else if (
			state == TARGETADJ_CARD.browse &&
			(fstatusflag == FBILLSTATUS.free ||
				fstatusflag == FBILLSTATUS.approve ||
				fstatusflag == FBILLSTATUS.commit ||
				fstatusflag == FBILLSTATUS.unapproved)
		) {
			buttonAry = [openorclose];
		} else if ((state == TARGETADJ_CARD.edit || state == TARGETADJ_CARD.add) && this.state.copyRowDatas == null) {
			buttonAry = [openorclose, TARGETADJ_CARD_BUTTON.Delete_row, TARGETADJ_CARD_BUTTON.InsertLine];
		} else {
			buttonAry = [TARGETADJ_CARD_BUTTON.PasteThis];
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
	let rowsdata = this.props.cardTable.getCheckedRows(TARGETADJ_CARD.tableId);
	let rowsflag = true; //根据勾选行数控制肩部可用按钮
	let pk_org = this.props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.pk_org);
	let hava_pkorg = true; //根据主组织控制增行的可用性
	let onhandflag = true; //控制存量查拣按钮可用性
	if (pk_org && pk_org.value && this.props.cardTable.getAllRows(TARGETADJ_CARD.tableId).length) {
		onhandflag = false;
	} else if (this.props.getUrlParam(TARGETADJ_CARD.status) == TARGETADJ_CARD.browse) {
		onhandflag = false;
	}
	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	if (pk_org && pk_org.value) {
		hava_pkorg = false;
	}
	let disableArr = {
		[TARGETADJ_CARD_BUTTON.AddLine]: hava_pkorg,
		[TARGETADJ_CARD_BUTTON.DeleteLine]: rowsflag
	};
	this.props.button.setDisabled(disableArr);
}
function setSagaBtnState(status) {
	let sagaStatus = this.props.form.getFormItemsValue([TARGETADJ_CARD.formId], ATTRCODE.sagaStatus);
	//status = TARGETADJ_CARD.browse; // 第一次进入卡片页，frozen为空，取界面sags_statue的值判断冻结状态
	let frozen = sagaStatus && sagaStatus.value == '1' ? true : false;
	// 设置回退、重试按钮状态，用来是否显示
	if (status == TARGETADJ_CARD.browse && frozen) {
		this.props.button.toggleErrorStatus(TARGETADJ_CARD.formId, {
			isError: true
		});
	} else {
		this.props.button.toggleErrorStatus(TARGETADJ_CARD.formId, {
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
