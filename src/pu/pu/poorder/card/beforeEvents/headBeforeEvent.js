/*
 * @Author: CongKe 
 * @PageInfo: 采购订单卡片表头编辑后事件
 * 所有字段的主组织过滤均在init中统一加入一次
 * @Date: 2018-07-25 10:02:28 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-04-25 16:32:20
 */
import { FIELD, PAGECODE, URL, TRANSFER } from '../../constance';
import vbillcodeBeforeEvent from './vbillcodeBeforeEvent';
import vtrantypecode from './vtrantypecode';
import remoteRequest from './remoteRequest';
import { crossRuleUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default async function(props, moduleId, key, value) {
	let _this = this;
	let flag = true;
	let constance = {};
	let transfer = this.props.getUrlParam(TRANSFER.transfer);
	transfer = transfer == null ? this.props.getUrlParam(TRANSFER.channelType) : transfer;
	let meta = this.props.meta.getMeta();
	let tailinfo = [
		'billmaker',
		'dmakedate',
		'approver',
		'taudittime',
		'crevisepsn',
		'trevisiontime',
		'pk_freezepsndoc',
		'tfreezetime',
		'iprintcount',
		'creator',
		'creationtime',
		'modifier',
		'modifiedtime'
	];
	// 编辑表头需要有表体的字段
	let needBodys = [ FIELD.nhtaxrate ];
	if (key == FIELD.vbillcode) {
		constance = {
			key: FIELD.vbillcode,
			formareaid: PAGECODE.cardhead,
			pk_org_key: FIELD.pk_org,
			billtype: PAGECODE.billType
		};
		flag = await vbillcodeBeforeEvent.call(this, props, constance);
	} else if (key == FIELD.cemployeeid) {
		// 原nc的业务员的编辑前事件是根据采购组织和采购部门参照过滤的
		flag = true;
	} else if (key == FIELD.pk_dept_v) {
		// 原nc的采购部门编辑前事件根据采购组织和采购部门oid过滤
		flag = true;
	} else if (key == FIELD.pk_dept) {
		// 原nc的采购部门编辑前事件根据采购组织和采购部门oid过滤
		flag = true;
	} else if (key == FIELD.ctrantypeid) {
		// 交易类型
		flag = await vtrantypecode.call(this);
		let transty = transtypeUtils.beforeEdit.call(this, key, FIELD.ctrantypeid, FIELD.vtrantypecode);
		flag = flag && transty;
		let forderstatus = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'forderstatus'); //单据状态
		forderstatus = forderstatus && forderstatus.value;
		flag = forderstatus == FIELD.approve ? false : flag;
	} else if (key == FIELD.pk_supplier_v) {
		// 供应商
		flag = true;
		let vcoopordercode = _this.props.form.getFormItemsValue(PAGECODE.cardhead, 'vcoopordercode').value;
		if (vcoopordercode != null) {
			flag = false;
		}
		if (this.props.getUrlParam('transfer') == 'Z2') {
			//拉合同过来不可编辑供应商
			flag = false;
		}
		if (flag) {
			meta[PAGECODE.cardhead].items.map((item) => {
				if (item.attrcode == key) {
					item.queryCondition = () => {
						let orgs = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
						return {
							pk_org: orgs
						};
					};
				}
			});
			// props.meta.setMeta(meta);
		}
	} else if (key == FIELD.pk_freecust) {
		// 散户
		let pk_supplier = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_supplier).value;
		pk_supplier = pk_supplier == '' ? null : pk_supplier;
		flag = pk_supplier == null ? false : flag;
		if (null != pk_supplier) {
			constance.key = key;
			constance.params = {
				pk_supplier: pk_supplier
			};
			flag = await remoteRequest(URL.headbeforeedit, constance);
			if (flag) {
				// 过滤
				meta[PAGECODE.cardhead].items.map((item) => {
					if (item.attrcode == key) {
						item.queryCondition = () => {
							let orgs = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
							let pk_dept = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_dept).value;
							pk_supplier = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_supplier)
								.value;
							return {
								// pk_org: orgs,
								pk_supplier: pk_supplier,
								customSupplier: pk_supplier
								// GridRefActionExt: 'nccloud.web.pu.order.ref.FreecustRefFilter'
							};
						};
					}
				});
				props.meta.setMeta(meta);
			}
		}
	} else if (key == FIELD.pk_bankdoc) {
		//银行账户
		flag = true;
	} else if (key == FIELD.pk_deliveradd) {
		//供应商发货地址
		flag = true;
		let pk_supplier = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_supplier).value;
		if (pk_supplier == null) {
			flag = false;
		}
	} else if (key == FIELD.corigcurrencyid) {
		flag = true;
		//币种 原币 编辑前
		let table = _this.props.cardTable.getAllData(PAGECODE.cardbody);
		//取到表体所有行 判断每行合同是否为空，只要有不为空的 就不可编辑 flag =fale;
		table.rows.map((o) => {
			let ccontractid = o.values.ccontractid.value;
			if (ccontractid != null && ccontractid != '') {
				flag = false;
			}
		});
		if (this.props.getUrlParam('transfer') == 'Z2') {
			//拉合同时不可编辑
			flag = false;
		}
	} else if (key == FIELD.pk_payterm) {
		//
		flag = true;
		// 付款协议编辑前,主组织过滤
		let bisreplenish = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.bisreplenish).value;
		if (bisreplenish == true) {
			flag = false;
		}
	} else if (key == 'vmemo') {
		flag = true;
	} else if (key == 'bisreplenish') {
		//补货 一直不可编辑
		flag = false;
	} else if (key == 'breturn') {
		// 退货
		// 补货不可编辑
		flag = true;
		flag = transfer == 'MULTI' ? false : flag;
	} else if (key == 'brefwhenreturn') {
		// 退货 / 库基于原订单补货
		// 补货不可编辑
		flag = true;
		flag = transfer == 'MULTI' ? false : flag;
	} else if (tailinfo.includes(key)) {
		//表尾信息
		flag = false;
	} else if (needBodys.includes(key)) {
		// NCC-136131 编辑整单税率时，需要表体，这里判断一下
		let rows = this.props.cardTable.getVisibleRows(PAGECODE.cardbody);
		flag = false;
		if (rows.length <= 0) {
			flag = false;
		} else {
			for (let i = 0; i < rows.length; i++) {
				if (rows[i].values[FIELD.pk_material].value) {
					flag = true;
					break;
				}
			}
		}
		if (!flag) {
			showErrorInfo(null, '表体为空！');
		}
	}
	let record = null;
	let crossRuleParams = {
		props,
		key, //当前字段
		appcode: null, //小应用编码，如果是本应用，可为空
		pagecode: PAGECODE.cardcode, //页面编码
		headarea: PAGECODE.cardhead, //表头区域编码
		bodyarea: PAGECODE.cardbody, //表体区域编码
		isHead: true, //是否为表头区字段
		record, //当前表体行数据，如果是表头触发，可以为空
		pk_org_field: FIELD.pk_org, //组织字段，注意为oid
		billtype: '21', //单据类型
		transtypeid_field: FIELD.ctrantypeid //交易类型id字段
	};
	crossRuleUtils.beforeEdit.call(this, crossRuleParams);
	return flag;
}
