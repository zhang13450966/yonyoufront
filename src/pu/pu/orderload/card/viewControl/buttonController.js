import { URL, AREA, FIELDS, BUTTONID, STATUS, DATASOURCECACHE } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

/**
 * 页面主控
 * @param {*} props
 */
function togglePageShow(props) {
	props.beforeUpdatePage();
	let status = props.getUrlParam(STATUS.status);
	status = status == null ? props.form.getFormStatus(AREA.card_head) : status;
	let billpk = props.form.getFormItemsValue(AREA.card_head, FIELDS.pk_order);
	billpk = billpk && billpk.value;
	billpk = billpk == null ? props.getUrlParam('id') : billpk;
	status = status == null || (billpk == null || billpk == 'null') ? STATUS.browse : STATUS.edit;
	let flag = status != STATUS.browse ? true : false;
	if (!billpk || billpk == 'null') {
		//清空页面
		props.form.EmptyAllFormValue(AREA.card_head); //订单
		//执行跳出堆栈
		props.cardTable.setTableData(AREA.card_body, { rows: [] }); //物料
		props.initMetaByPkorg('pk_org_v');
	}
	let bisLoad = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELDS.bisload);
	let isLoad = bisLoad == 'N' || bisLoad == false ? true : false; // 是否装运
	//edit
	// 装运
	props.button.setButtonVisible([ BUTTONID.Load ], flag && isLoad);
	// 反装运
	props.button.setButtonVisible([ BUTTONID.UNLoad ], flag && !isLoad);
	//browse
	props.button.setButtonVisible([ BUTTONID.Refresh, BUTTONID.Print ], flag);
	let selectedRow = props.cardTable.getCheckedRows(AREA.card_body);
	let rowsflag = selectedRow.length > 0 ? false : true;
	let disableArr = { [BUTTONID.Load]: rowsflag, [BUTTONID.UNLoad]: rowsflag };
	props.button.setDisabled(disableArr);
	props.form.setFormStatus(AREA.card_head, status);
	props.cardTable.setStatus(AREA.card_body, status);
	//修改组织的不可编辑
	props.form.setFormItemsDisabled(AREA.card_head, { [FIELDS.pk_org]: true });
	//设置卡片翻页的显隐性
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
	let vbillcode = props.form.getFormItemsValue([ AREA.card_head ], FIELDS.vbillcode);
	props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: true,
		showBillCode: flag,
		billCode: vbillcode && vbillcode.value
	});
	props.updatePage(AREA.cardFormId, AREA.cardTableId);
}

/**
 * 表体勾选事件
 * @param {*} props
 */
function onSelect(props) {
	let selectedRow = props.cardTable.getCheckedRows(AREA.card_body);
	let rowsflag = selectedRow.length > 0 ? false : true;
	let disableArr = { [BUTTONID.Load]: rowsflag, [BUTTONID.UNLoad]: rowsflag };
	props.button.setDisabled(disableArr);
}

export default { togglePageShow, onSelect };
