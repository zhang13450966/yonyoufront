import { URL, PAGECODE, FIELD, BUTTON, STATUS } from '../../constance';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';

/**
 * 卡片操作行按钮
 */
function getCardRowButtons() {
	let buttonAry = [];
	if (this.props.getUrlParam(STATUS.status) === STATUS.browse) {
		buttonAry = [ BUTTON.openbrowse ];
	} else {
		if (this.copyRowDatas == null) {
			buttonAry = [ BUTTON.openedit, BUTTON.Material_DeleteLine, BUTTON.CopyLine_row, BUTTON.InsertLine ];
		} else {
			buttonAry = [ BUTTON.PasteThis ];
		}
	}
	return buttonAry;
}

/**
 * 表体勾选事件
 */
function metarialSelected(props) {
	let rowsdata = props.cardTable.getCheckedRows(PAGECODE.cardbody);
	let rowsflag = true;
	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	let disableArr = {
		[BUTTON.materialDeleteLine]: rowsflag,
		[BUTTON.copyline]: rowsflag,
		[BUTTON.LinkPoPlan]: rowsflag,
		[BUTTON.StockQuery]: rowsflag,
		[BUTTON.puinquiry]: rowsflag,
		[BUTTON.checkpuinquiry]: rowsflag
	};
	props.button.setDisabled(disableArr);
}

/**
 * 页面按钮主控
 * @param {*} props
 */
function togglePageShow(props) {
	props.beforeUpdatePage();
	let status = props.getUrlParam(STATUS.status);
	status = status == null ? props.form.getFormStatus(PAGECODE.cardhead) : status;
	let pk = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
	pk = pk && pk.value;
	pk = pk == null ? props.getUrlParam(FIELD.id) : pk;
	let flag = false;
	let forderstatus = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.forderstatus); //单据状态
	if (status != STATUS.browse) {
		status = STATUS.edit;
		//表格改为编辑态
		flag = true;
		if (!pk) {
			//清空页面
			props.form.EmptyAllFormValue(PAGECODE.cardhead); //订单
			//执行跳出堆栈
			props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }); //物料
			props.initMetaByPkorg(FIELD.pk_org_v);
		}
	} else {
		status = STATUS.browse;
	}
	let nversion = props.form.getFormItemsValue(PAGECODE.cardhead, 'nversion');
	nversion = nversion && nversion.value;
	nversion = nversion == null ? 1 : nversion;
	let revise = false;
	if (nversion > 1 && status != STATUS.edit) {
		//修订历史
		revise = true;
	}
	props.button.setButtonVisible([ BUTTON.Revised_Record_Info ], revise);
	props.button.setButtonVisible([ BUTTON.SupplierAp ], true);

	//edit
	props.button.setButtonVisible(
		[
			BUTTON.Save,
			BUTTON.Cancel,
			BUTTON.Card_Body_Group1,
			BUTTON.Material_PastLast,
			BUTTON.Resetno,
			BUTTON.openedit,
			BUTTON.materialDeleteLine,
			BUTTON.CopyLine_row,
			BUTTON.InsertLine,
			BUTTON.SaveCommit,
			BUTTON.Card_Body_Group2
		],
		flag
	);
	//browse
	props.button.setButtonVisible(
		[
			BUTTON.Back,
			BUTTON.Revise,
			BUTTON.Annex_Management,
			BUTTON.QueryAboutBusiness,
			BUTTON.ApproveInfo,
			BUTTON.Print,
			BUTTON.PrintCountQuery,
			BUTTON.Refresh,
			BUTTON.LinkPoPlan,
			BUTTON.openbrowse,
			BUTTON.Commit,
			BUTTON.UnCommit,
			BUTTON.Delete,
			BUTTON.ToInformation
		],
		!flag
	);
	let bfrozen = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.bfrozen); //冻结
	bfrozen = bfrozen && bfrozen.value == true ? true : false;
	let rowsflag = true;
	let selectedRow = props.cardTable.getCheckedRows(PAGECODE.cardbody);
	if (selectedRow.length > 0) {
		rowsflag = false;
	}
	let linkPlanFlag = true;
	if (!flag && selectedRow.length > 0) {
		linkPlanFlag = false;
	}
	let disableArr = {
		[BUTTON.materialDeleteLine]: rowsflag,
		[BUTTON.copyline]: rowsflag,
		[BUTTON.LinkPoPlan]: linkPlanFlag,
		[BUTTON.StockQuery]: rowsflag,
		[BUTTON.puinquiry]: rowsflag,
		[BUTTON.checkpuinquiry]: rowsflag,
		[BUTTON.Print]: bfrozen == true ? true : false,
		[BUTTON.PrintCountQuery]: bfrozen == true ? true : false
	};
	if (forderstatus) {
		//控制提交按钮的不可见场景
		if (
			forderstatus.value == FIELD.approve ||
			forderstatus.value == FIELD.approved ||
			forderstatus.value == FIELD.unapproved
		) {
			props.button.setButtonVisible([ BUTTON.Commit ], false);
		}
		//控制修订删除按钮的不可见场景
		if (forderstatus.value == FIELD.approve || forderstatus.value == FIELD.approved) {
			props.button.setButtonVisible([ BUTTON.Delete ], false);
		}
		//控制收回按钮的不可见场景
		if (
			forderstatus.value == FIELD.approved ||
			forderstatus.value == FIELD.free ||
			forderstatus.value == FIELD.unapproved
		) {
			props.button.setButtonVisible([ BUTTON.UnCommit ], false);
		}
		//控制修订按钮的不可见场景
		if (forderstatus.value == FIELD.approve) {
			props.button.setButtonVisible([ BUTTON.Revise ], false);
		}
	}
	props.button.setDisabled(disableArr);
	props.button.setButtonVisible([ BUTTON.Material_PastLast ], false);
	props.form.setFormStatus(PAGECODE.cardhead, status);
	props.cardTable.setStatus(PAGECODE.cardbody, status);
	//修改组织的不可编辑
	props.form.setFormItemsDisabled(PAGECODE.cardhead, { [FIELD.pk_org]: true });
	//设置卡片翻页的显隐性
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);
	let vbillcode = props.form.getFormItemsValue([ PAGECODE.cardhead ], FIELD.vbillcode);
	props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: !flag,
		showBillCode: !flag,
		billCode: vbillcode && vbillcode.value
	});
	//设置saga相关按钮状态
	setSagaBtnState(props, status);

	let _this = this;
	let tabkey = _this.tabKey;
	//表体肩部按钮显隐控制
	tabChange.call(_this, props, null, tabkey);
	props.updatePage(PAGECODE.cardhead, [ PAGECODE.cardbody ]);
}

/**
 * 物料表体复制取消
 * @param {*} props
 */
function materialPasteCancel(props) {
	props.button.setButtonVisible(
		[
			BUTTON.Card_Body_Group1,
			BUTTON.Resetno,
			BUTTON.openedit,
			BUTTON.materialDeleteLine,
			BUTTON.CopyLine_row,
			BUTTON.InsertLine,
			BUTTON.Material_DeleteLine,
			BUTTON.StockQuery,
			BUTTON.puinquiry,
			BUTTON.checkpuinquiry
		],
		true
	);
	props.button.setButtonVisible([ BUTTON.PasteThis, BUTTON.PasteLast, BUTTON.PasteCancel ], false);
	rowCopyPasteUtils.cancel.call(
		this,
		props,
		PAGECODE.cardbody,
		BUTTON.materialCardInitBtn,
		BUTTON.materialCardPastBtn
	);
}

function setSagaBtnState(props, status) {
	//冻结交互
	let sagaStatus = props.form.getFormItemsValue([ PAGECODE.cardhead ], 'saga_status');
	// 第一次进入卡片页，frozen为空，取界面sags_statue的值判断冻结状态
	let frozen = sagaStatus && sagaStatus.value == '1' ? true : false;
	// 设置回退、重试按钮状态，用来是否显示
	if (status == STATUS.browse && frozen) {
		props.button.toggleErrorStatus(PAGECODE.cardhead, {
			isError: true
		});
	} else {
		props.button.toggleErrorStatus(PAGECODE.cardhead, {
			isError: false
		});
	}
}

/**
 * 卡片共享页签切换事件
 * @param {*} props
 * @param {*} moduleId
 * @param {*} key
 */
function tabChange(props, moduleId, key) {
	let flag = false;
	if (PAGECODE.cardbody == key && STATUS.browse != props.getUrlParam(STATUS.status)) {
		flag = true;
	}
	if (PAGECODE.cardbody != key) {
		props.button.setButtonVisible([ BUTTON.StockQuery ], false);
		props.button.setButtonVisible([ BUTTON.LinkPoPlan ], false);
	} else {
		props.button.setButtonVisible([ BUTTON.StockQuery ], true);
		if (props.getUrlParam(STATUS.status) == STATUS.browse) {
			props.button.setButtonVisible([ BUTTON.LinkPoPlan ], true);
		} else {
			props.button.setButtonVisible([ BUTTON.LinkPoPlan ], false);
		}
	}
	props.button.setButtonVisible([ BUTTON.Card_Body_Group1, BUTTON.Card_Body_Group2, BUTTON.Resetno ], flag);
	metarialSelected(props);
}

export default { getCardRowButtons, metarialSelected, togglePageShow, tabChange, materialPasteCancel };
