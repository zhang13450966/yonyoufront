/*
 * @Author: jiangfw 
 * @PageInfo: 卡片复制
 * @Date: 2018-06-02 16:14:29 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:51:32
 */
import { URL, UISTATE, FIELD, INVC_UI_STATE, PAGECODE } from '../../constance';
import { getHeadValue } from '../utils/cardUtil';
import loadData from '../init/loadData';

export default function clickCopyBtn() {
	// this.props.pushTo(URL.card, {
	// 	status: UISTATE.add
	// });
	// 清除部分字段值
	// clearData.call(this);
	// 设置表头字段默认值
	// setHeadDefaultValues.call(this);
	//设置组织字段不可编辑
	// this.props.form.setFormItemsDisabled(this.formId, { [FIELD.pk_org_v]: true });
	// 放开其他字段编辑性
	// this.props.cardTable.setStatus([ AREA.card_body ], UISTATE.edit);
	let id = getHeadValue(this.props, FIELD.pk_invoice).value;
	this.props.pushTo(URL.card, {
		status: UISTATE.edit,
		id,
		copy: true,
		option: 'copy',
		pagecode: PAGECODE.invoiceCard
	});
	loadData.call(this);
}

/**
 * 设置表头默认值
 */
function setHeadDefaultValues() {
	// 制单人、创建人 TODO
	// 交易类型 参考 nc.ui.pu.m25.action.processor.CopyActionProcessor

	// this.props.form.setFormItemsValue(this.formId, { [FIELD.iprintcount]: { value: 0 } }); //打印次数为0
	// this.props.form.setFormItemsValue(this.formId, { [FIELD.fbillstatus]: { value: 0 } }); //单据状态自由态
	let currentTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
	this.props.form.setFormItemsValue(this.formId, { [FIELD.dbilldate]: { value: currentTime } }); //发票日期
	this.props.form.setFormItemsValue(this.formId, { [FIELD.darrivedate]: { value: currentTime } }); //票到日期
	// this.props.form.setFormItemsValue(this.formId, { [FIELD.dmakedate]: { value: currentTime } }); //制单日期
	this.props.form.setFormItemsValue(this.formId, { [FIELD.bapflag]: { value: false } }); //已传应付标志
	let invoiceUIstate = this.state.invoiceUIstate;
	// 正常发票界面复制费用发票的时候，清空费用相关信息
	if (invoiceUIstate != INVC_UI_STATE.fee_invc) {
		this.props.form.setFormItemsValue(this.formId, { [FIELD.bfee]: { value: false } }); //费用发票
		this.props.form.setFormItemsValue(this.formId, { [FIELD.pk_parentinvoice]: { value: null } }); //费用发票对应货物发票
	}
	this.props.form.setFormItemsValue(this.formId, { [FIELD.bfrozen]: { value: false } }); //冻结
	this.props.form.setFormItemsValue(this.formId, { [FIELD.bvirtual]: { value: false } }); //虚拟发票标志
	this.props.form.setFormItemsValue(this.formId, { [FIELD.binitial]: { value: false } }); //是否期初发票
}

/**
 * 清空单据部分字段值
 */
function clearData() {
	// 清除表头表体数据
	this.setState({
		billcode: ''
	});

	// 表头待清空字段
	let clearHeadItems = [
		FIELD.vbillcode, //发票号
		FIELD.pk_invoice, //发票主键
		FIELD.ts,
		FIELD.approver, //审批人
		FIELD.taudittime, //审批日期
		FIELD.modifier, //最后修改人
		FIELD.modifiedtime, //最后修改时间
		// FIELD.billmaker, //制单人
		FIELD.dmakedate, //制单日期
		FIELD.pk_frozenuser, //冻结人
		FIELD.tfrozentime, //冻结日期
		FIELD.vfrozenreason, //最后冻结原因
		FIELD.fbillstatus //单据状态
		// FIELD.ctrantypeid, //发票类型
		// FIELD.vtrantypecode //发票类型编码
	];
	for (let headItem of clearHeadItems) {
		this.props.form.setFormItemsValue(this.formId, { [headItem]: { value: null } });
	}

	// 表体待清空字段
	let clearBodyItems = [
		FIELD.pk_invoice, //发票主键
		FIELD.pk_invoice_b, //采购发票明细
		FIELD.cfirstbid, //源头单据行主键
		FIELD.cfirstid, //源头单据主键
		FIELD.cfirsttypecode, //源头单据类型
		FIELD.vfirstcode, //源头单据号
		FIELD.vfirstrowno, //源头单据行号
		FIELD.vfirsttrantype, //源头交易类型
		FIELD.firstbts, //源头单据行TS
		FIELD.firstts, //源头单据TS
		FIELD.csourcebid, //来源单据行主键
		FIELD.csourceid, //来源单据主键
		FIELD.csourcetypecode, //来源单据类型
		FIELD.sourcebts, //来源单据行TS
		FIELD.sourcets, //来源单据TS
		FIELD.vsourcecode, //来源单据号
		FIELD.vsourcerowno, //来源单据行号
		FIELD.vsourcetrantype, //来源交易类型
		FIELD.ts,
		FIELD.naccumsettmny, //累计本币结算金额
		FIELD.naccumsettnum, //累计结算主数量
		FIELD.pk_order, //采购订单主键
		FIELD.pk_order_b, //采购订单行主键
		FIELD.vordercode, //订单号
		FIELD.vordertrantype //发票类型(交易类型)
		// FIELD.
	];
	let rows = this.props.cardTable.getNumberOfRows(this.tableId);
	for (let row = 0; row < rows; row++) {
		for (let bodyItem of clearBodyItems) {
			this.props.cardTable.setValByKeyAndIndex(this.tableId, row, bodyItem, {
				value: null,
				display: null,
				scale: '-1'
			});
		}
	}
}
