import {
	AREA,
	ALLBUTTONS,
	EDITBUTTONS,
	TRANSFERFREEBUTTONS,
	TRANSFERFAILBUTTONS,
	FREEBUTTONS,
	FAILBUTTONS,
	COMMITBUTTONS,
	EXEBUTTONS,
	TRANSFERCOMMITBUTTONS,
	TRANSFEREXEBUTTONS,
	ADDBUTTONS,
	BUTTONAREA,
	FIELD,
	COMMON
} from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

/*
 * @Author: zhangshqb
 * @PageInfo: 按钮的状态控制
 * 包括显示隐藏，可用性
 * @Date: 2019-1-9 10:42:16
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-23 13:45:08
 */

export default function(status) {
	if (!status) {
		status = this.props.getUrlParam('status');
		if (status == undefined) {
			status = this.props.form.getFormStatus(AREA.form);
		}
	}

	let sagaStatus = this.props.form.getFormItemsValue([ AREA.head ], FIELD.sagaStatus); //获得saga状态 // 第一次进入卡片页，frozen为空，取界面sags_statue的值判断冻结状态
	let frozen = sagaStatus && sagaStatus.value == '1' ? true : false;

	// 1.设置界面状态
	setUIState.call(this, this.props, status);

	let isBrowse = status === 'browse';
	if (status === 'return23') {
		isBrowse = false;
	}
	// 2.设置按钮的显示隐藏
	setCardButtonVisiable.call(this, this.props, status, isBrowse);

	// 4.返回按钮的显示隐藏
	setBackButtonVisiable.call(this, this.props, isBrowse);
	// 5.设置卡片分页器的显示隐藏
	setCardPaginationVisible.call(this, this.props, isBrowse);
	// 6.设置按钮的可用性
	setCardButtonDisiable.call(this, this.props, isBrowse);

	if (status != 'edit' && status != 'browse') {
		this.props.executeAutoFocus();
	}
	setSagaBtnState.call(this, status, frozen);
}

function setOtherButtonVisiable(props, isBrowse) {
	let isTransfer = isFromTransfer.call(this, props);
	// 1.【退出转单按钮】的控制
	if (!isTransfer) {
		props.button.setButtonVisible('Quit', false);
	} else {
		props.button.setButtonVisible('Quit', true);
	}

	// 3.支持审批中修改
	if (isBrowse && isFromApproveCenter.call(this, props)) {
		let billstatus = (props.form.getFormItemsValue(AREA.form, 'fbillstatus') || {}).value;
		if (billstatus == 2 || billstatus == 1) {
			props.button.setButtonVisible('Edit', true);
		}
	}

	// 4. 根据流程控制按钮
	let billtypes = getDefData(COMMON.arrivalRefBillCachekey, 'refBillDataCach');
	if (billtypes) {
		if (billtypes.indexOf('61') < 0) {
			this.props.button.setButtonVisible('RefSubcont', false);
		}
		if (billtypes.indexOf('21') < 0) {
			this.props.button.setButtonVisible('RefOrder', false);
		}
	}
}

function setCardButtonDisiable(props, isBrowse) {
	//界面无数据时"原到货单退货"不可用
	let pk_arriveorder = (props.form.getFormItemsValue(AREA.form, 'pk_arriveorder') || {}).value;
	if (isBrowse && !pk_arriveorder) {
		props.button.setButtonDisabled([ 'ReturnArrival' ], true);
	} else if (isBrowse && pk_arriveorder) {
		props.button.setButtonDisabled([ 'ReturnArrival' ], false);
	}

	let rows = props.cardTable.getCheckedRows(AREA.body);
	if (rows && rows.length > 0) {
		props.button.setButtonDisabled([ 'StockQuery', 'UrgentLetGo' ], false);
	} else {
		props.button.setButtonDisabled([ 'StockQuery', 'UrgentLetGo' ], true);
	}
}

function setCardPaginationVisible(props, isBrowse) {
	let showPage = isBrowse;
	let billstatus = (props.form.getFormItemsValue(AREA.form, 'fbillstatus') || {}).value;
	// 卡片下空白界面不需要显示分页
	if (!billstatus) {
		showPage = false;
	} else if (isFromApproveCenter.call(this, props)) {
		showPage = false;
	}
	// 设置卡片分页的显示隐藏
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', showPage);
}

/**
 * 设置返回按钮的可见性
 * @param {*} props
 */
function setBackButtonVisiable(props, isBrowse) {
	// 只有自制的编辑态没有返回按钮
	let isShowReturn = true;

	let isTransfer = isFromTransfer.call(this, props);
	if (!isTransfer) {
		isShowReturn = isBrowse;
	}

	if (isFromApproveCenter.call(this, props)) {
		isShowReturn = false;
	}
	props.BillHeadInfo.setBillHeadInfoVisible({
		showBillCode: true,
		billCode: props.form.getFormItemsValue([ AREA.head ], FIELD.vbillcode).value, //修改单据号---非必传,
		showBackBtn: isShowReturn //控制显示返回按钮: true为显示,false为隐藏 ---非必传
	});
	if (this.isapprove == 'Y') {
		props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false
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

function isFromTransfer(props) {
	let transfer = this.props.getUrlParam('type');
	let isTransfer = transfer != undefined;
	return isTransfer;
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status
 */
function setUIState(props, status) {
	let pk = props.getUrlParam('id');
	let formstatus = null;
	let tablestatus = null;
	if (status == 'browse') {
		formstatus = 'browse';
		tablestatus = 'browse';
	} else {
		formstatus = 'edit';
		tablestatus = 'edit';
	}
	props.form.setFormStatus(AREA.form, formstatus);
	props.cardTable.setStatus(AREA.body, tablestatus);
}

//切换页面状态
// toggleShow = (fbillstatus) => {
// 	let status = this.props.getUrlParam('status');
// 	let flag = status === 'browse' ? false : true;
// 	this.props.button.setButtonVisible(ALLBUTTONS, false);
// 	if (status == 'edit' || status == 'return23') {
// 		this.props.button.setButtonVisible(EDITBUTTONS, true);
// 		this.props.button.setButtonVisible(
// 			[
// 				'PaseToThis', //粘贴至此
// 				'PastToLast', //粘贴至末行
// 				'CancelPast' //取消(复制)
// 			],
// 			false
// 		);
// 		this.props.button.setButtonDisabled([ 'ResetRowno' ], false);
// 		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
// 		this.props.button.setButtonVisible('Return', false);
// 		this.setState({ isShowBack: false });
// 	} else if (fbillstatus == 0) {
// 		this.props.button.setButtonVisible(FREEBUTTONS, true);

// 		if (this.isapprove == 'Y') {
// 			this.props.button.setButtonVisible([ 'Edit' ], false);
// 			this.setState({ isShowBack: false });
// 			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
// 		} else {
// 			this.setState({ isShowBack: true });
// 			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
// 		}
// 	} else if (fbillstatus == 1 || fbillstatus == 2) {
// 		this.props.button.setButtonVisible(COMMITBUTTONS, true);
// 		if (this.isapprove == 'Y') {
// 			this.props.button.setButtonVisible([ 'Edit' ], true);
// 			this.setState({ isShowBack: false });
// 			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
// 		} else {
// 			this.setState({ isShowBack: true });
// 			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
// 		}
// 	} else if (fbillstatus == 3) {
// 		this.props.button.setButtonVisible(EXEBUTTONS, true);
// 		let selectedRow = this.props.cardTable.getCheckedRows(AREA.body);
// 		if (selectedRow == null || selectedRow.length == 0) {
// 			this.props.button.setButtonDisabled(
// 				[ 'Check', 'GenAssertCard', 'DelAssertCard', 'GenTransAssert', 'DelTransAssert' ],
// 				true
// 			);
// 		}
// 		if (this.isapprove == 'Y') {
// 			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
// 			this.setState({ isShowBack: false });
// 		} else {
// 			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
// 			this.setState({ isShowBack: true });
// 		}
// 	} else if (fbillstatus == 4) {
// 		this.props.button.setButtonVisible(FAILBUTTONS, true);
// 		this.setState({ isShowBack: true });
// 		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
// 	}
// };

/**
 * //1.优先根据界面状态判断显示按钮显示
	// 2.再根据单据状态控制按钮显示
 * @param {*} props 
 * @param {*} status 
 */
function setCardButtonVisiable(props, status, isBrowse) {
	// 1.设置表头按钮
	if (isBrowse) {
		// 先设置按钮全不显示
		props.button.setButtonVisible(ALLBUTTONS, false);
		// 再根据状态设置按钮显示
		props.button.setButtonVisible(getShowBtnArray(props), true);
	} else {
		// 先设置按钮全不显示
		props.button.setButtonVisible(ALLBUTTONS, false);
		// 再根据状态设置按钮显示
		props.button.setButtonVisible(EDITBUTTONS, true);
	}

	// 2.设置肩部按钮
	// 如果是卡片浏览态
	// 要根据单据状态进行肩部按钮的显示和隐藏
	// props.button.setButtonVisible(CARD_BODY_BUTTONS.ALL, false);
	if (!isBrowse) {
		props.button.setButtonVisible(
			[
				'PaseToThis', //粘贴至此
				'PastToLast', //粘贴至末行
				'CancelPast' //取消(复制)
			],
			false
		);
	}

	setOtherButtonVisiable.call(this, props, isBrowse);

	// 3. 控制表体肩部按钮
	// rowbtn_Controller.call(this);
}

function getShowBtnArray(props) {
	let billstatus = (props.form.getFormItemsValue(AREA.form, 'fbillstatus') || {}).value;
	let type = props.getUrlParam('type');
	if (type) {
		switch (billstatus) {
			case null:
				return '';
			case undefined:
				return '';
			// 自由态行按钮
			case '0':
				return TRANSFERFREEBUTTONS;
			// 审批不通过
			case '4':
				return TRANSFERFAILBUTTONS;
			// 审批中
			case '1':
				return TRANSFERCOMMITBUTTONS;
			case '2':
				return TRANSFERCOMMITBUTTONS;
			// 审批通过
			case '3':
				return TRANSFEREXEBUTTONS;
			default:
				return '';
		}
	} else {
		switch (billstatus) {
			case null:
				return ADDBUTTONS;
			case undefined:
				return ADDBUTTONS;
			// 自由态行按钮
			case '0':
				return FREEBUTTONS;
			// 审批不通过
			case '4':
				return FAILBUTTONS;
			// 审批中
			case '1':
				return COMMITBUTTONS;
			case '2':
				return COMMITBUTTONS;
			// 审批通过
			case '3':
				return EXEBUTTONS;
			default:
				return '';
		}
	}
}

function setSagaBtnState(status, frozen) {
	// 设置回退、重试按钮状态，用来是否显示
	if (status == 'browse' && frozen) {
		this.props.button.toggleErrorStatus(BUTTONAREA.cardhead, {
			isError: true
		});
	} else {
		this.props.button.toggleErrorStatus(BUTTONAREA.cardhead, {
			isError: false
		});
	}
}
export { setSagaBtnState };
