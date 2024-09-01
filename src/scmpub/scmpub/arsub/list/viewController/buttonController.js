/*
 * @Author: 刘奇 
 * @PageInfo:界面状态-按钮控制
 * @Date: 2018-12-25 15:40:52 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-14 16:52:57
 */
import { ARSUB_CONST, LIST_HEAD_BROWSE_STATUS_ACTIONS, ArsubHeadItem, BILL_STATUS, BUTTON } from '../../const';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { getDefData } from '../../../pub/cache';
function buttonControl() {
	// 1、设置页面状态
	setUIState.call(this); // 2、按钮状态控制
	setButtonState.call(this); // 3、主按钮设置
	setMainButton.call(this); // 4、返回按钮控件状态控制
	setHeadInfoState.call(this); // 5、卡片分页器状态控制
	setCardPaginationState.call(this);
}

function setUIState() {}

function setButtonState() {
	this.props.button.setButtonDisabled(LIST_HEAD_BROWSE_STATUS_ACTIONS.ALL, true);
	// 除了新增其他按钮不可用
	this.props.button.setButtonDisabled(LIST_HEAD_BROWSE_STATUS_ACTIONS.I_NODATA, false);
	// 1.获取列表勾选的数据
	let selrows = this.props.table.getCheckedRows(ARSUB_CONST.formId);
	if (selrows == undefined || selrows.length == 0) {
		// 选择一个的时候，根据状态判断
	} else if (selrows.length == 1) {
		this.props.button.setButtonDisabled(getDisabledBtnArray(this.props), false);
	} else {
		// 多选时将所有按钮置为可见（按钮点击后，后台校验）
		this.props.button.setButtonDisabled(LIST_HEAD_BROWSE_STATUS_ACTIONS.ALL, false);
	}
	this.props.button.setPopContent(BUTTON.delete, getLangByResId(this, '4006ARSUB-000015')); /* 国际化处理： 确定要删除吗？*/
	//如果有查询缓存则刷新按钮可用
	if (getDefData(ARSUB_CONST.ArsubCacheKey, ARSUB_CONST.searchId)) {
		this.props.button.setDisabled({
			[BUTTON.refresh]: false
		});
	}
}
/**
 * 单选时根据单据状态判断按钮可用性
 * @param {*} props 
 */
function getDisabledBtnArray(props) {
	let selrows = props.table.getCheckedRows(ARSUB_CONST.formId);
	// 单据状态：1=自由，2=审批中，3=审批未通过，4=审批通过
	let billstatus = selrows[0].data.values[ArsubHeadItem.fstatusflag].value;
	switch (billstatus) {
		// 自由态
		case BILL_STATUS.I_FREE:
			return LIST_HEAD_BROWSE_STATUS_ACTIONS.I_FREE;
			break;
		// 审批不通过
		case BILL_STATUS.I_NOPASS:
			return LIST_HEAD_BROWSE_STATUS_ACTIONS.I_NOPASS;
			break;
		// 审批中
		case BILL_STATUS.I_AUDITING:
			return LIST_HEAD_BROWSE_STATUS_ACTIONS.I_AUDITING;
			break;
		// 审批通过
		case BILL_STATUS.I_AUDIT:
			return LIST_HEAD_BROWSE_STATUS_ACTIONS.I_AUDIT;
			break;
		// 关闭
		case BILL_STATUS.I_CLOSED:
			return LIST_HEAD_BROWSE_STATUS_ACTIONS.I_CLOSED;
			break;
		default:
			return '';
			break;
	}
}
function setMainButton() {}

function setHeadInfoState() {}

function setCardPaginationState() {}

export { buttonControl };
