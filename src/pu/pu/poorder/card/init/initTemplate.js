/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片态初始化事件
 * @Date: 2018-04-19 10:42:26
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-22 16:11:56
 */
import {
	URL,
	PAGECODE,
	FIELD,
	BUTTON,
	STATUS,
	TRANSFER,
	TRANSFER30TO21COOP,
	OrderCache,
	LIST_BUTTON
} from '../../constance';
import { copyAddBtn, pageInfoClick } from '../btnClicks';
import { setDefData, changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { afterEvents } from '../afterEvents';
import { transtypeUtils, deepClone } from '../../../../../scmpub/scmpub/pub/tool';
import { refBillQueryCache } from '../../../pub/refBillQueryCache/refBillQueryCache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonClickController, buttonController } from '../viewController/index';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
import { yycBtnInit } from '../../../yyc/ext/yycBtnInit';
import excelImportconfig from 'uap/common/components/excelImportconfig';

export default function() {
	//设置导入url  常量
	let excelimportconfig = excelImportconfig(
		this.props,
		FIELD.PURCHASEORG, //模块名称
		PAGECODE.billType, //单据类型
		true,
		URL.importUrl,
		{
			noTips: true,
			isSelfDefineImport: true
		}
	);
	this.props.createUIDom(
		{
			pagecode: PAGECODE.cardcode
		},
		(templedata) => {
			transtypeUtils.init.call(this, templedata.context);
			let templetid = templedata.template.pageid;
			setDefData(OrderCache.OrderCardCache, 'templetid', templetid);
			if (templedata.button) {
				let button = templedata.button;
				this.props.button.hideButtonsByAreas([ PAGECODE.cardhead ]);
				// this.props.button.setOprationBtnsRenderStatus([ PAGECODE.material_table_row ], false);
				buttonController.setOprationBtnsRenderStatus(this.props);
				this.props.button.setButtons(button);
				// 友云采按钮初始化
				yycBtnInit(this.props);
				//将导入组件注册到按钮中
				this.props.button.setUploadConfig(LIST_BUTTON.Import, excelimportconfig);
			}
			if (templedata.template) {
				this.meta = deepClone(templedata.template);
				let scene =
					templedata.context && templedata.context.paramMap && templedata.context.paramMap.SCM_ORDER_SCENE;
				//场景有新增小应用、拉单小应用
				scene = scene == null ? this.props.getUrlParam('scene') : scene;
				if (!scene) {
					scene = null;
				}
				let srcappcode = this.props.getUrlParam('srcappcode'); //拉单界面单独发布成小应用时使用的参数
				setDefData(OrderCache.OrderCardCache, 'scene', scene);
				setDefData(OrderCache.OrderCardCache, 'srcappcode', srcappcode);
				let meta = templedata.template;
				modifierMeta.call(this, meta, this.props);
				this.props.meta.setMeta(meta, toggleShow.bind(this, templedata));
			}
			let refBillQueryData = { billType: '21' };
			if (templedata.context.paramMap && templedata.context.paramMap.transtype) {
				refBillQueryData.transType = templedata.context.paramMap.transtype;
				setDefData(OrderCache.OrderCardCache, 'transtype', templedata.context.paramMap.transtype);
			}
			refBillQueryCache(refBillQueryData, OrderCache.refBillDataCach, 'refBillDataCach');
		}
	);
}

function modifierMeta(meta, props) {
	let _this = this;
	let status = this.props.getUrlParam(STATUS.status);

	if (status == STATUS.add) {
		changeUrlParam(this.props, { status: STATUS.edit });
	} else if (status == null) {
		changeUrlParam(this.props, { status: STATUS.browse });
	}
	// 采购订单新增节点用
	let sceneAdd = this.props.getUrlParam('scene');
	if (sceneAdd == 'ADD') {
		changeUrlParam(this.props, { status: null });
	}
	meta[PAGECODE.cardhead].status = status;
	meta[PAGECODE.cardbody].status = status;
	//编辑前 参照过滤
	meta[PAGECODE.cardhead].items.map((item) => {
		if (item.attrcode != FIELD.pk_org_v && item.attrcode != FIELD.pk_org && item.attrcode != FIELD.pk_dept_v) {
			item.isShowUnit = false;
			// item.queryCondition = () => {
			// 	let data = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
			// 	return { pk_org: data }; // 根据pk_org过滤
			// };
		}
		if (item.attrcode == FIELD.pk_org_v) {
			item.queryCondition = () => {
				//主组织权限过滤
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
			};
		} else if (item.attrcode == FIELD.ctrantypeid) {
			//订单类型过滤交易类型
			let filter = () => {
				let direct = _this.props.form.getFormItemsValue(PAGECODE.cardhead, 'bdirect').value;
				direct = JSON.stringify(direct) == '{}' ? false : direct;
				// 3.无来源时视为自制，可以参照所有交易类型
				let hasSource = false;
				let table = _this.props.cardTable.getAllData(PAGECODE.cardbody);
				if (!table || table.rows.length == 0) {
					hasSource = false;
				}
				table.rows.map((o) => {
					let sourceid = o.values.csourceid.value;
					let sourceTypeCode = o.values.csourcetypecode.value;
					let sourcebid = o.values.csourcebid.value;
					sourceid = sourceid == '' ? null : sourceid;
					sourceTypeCode = sourceTypeCode == '' ? null : sourceTypeCode;
					sourcebid = sourcebid == '' ? null : sourcebid;
					if (sourceid != null || sourceTypeCode != null || sourcebid != null) {
						hasSource = true;
					}
				});
				let pk_org = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				let pk_group = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_group).value;
				if (hasSource) {
					//有来源时要根据直运过滤
					return {
						istransaction: 'Y',
						parentbilltype: '21',
						SCM_CONSIDERBUSITYPE: 'Y',
						pk_group: pk_group,
						bdirect: direct,
						SCM_BUSIORG: pk_org,
						GridRefActionExt:
							'nccloud.web.pu.order.ref.Vtrantypecode,nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
					};
				} else {
					//订单类型过滤交易类型
					return {
						istransaction: 'Y',
						parentbilltype: '21',
						SCM_CONSIDERBUSITYPE: 'Y',
						pk_org: pk_org,
						SCM_BUSIORG: pk_org,
						GridRefActionExt:
							'nccloud.web.pu.order.ref.Vtrantypecode,nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
					};
				}
			};
			item.queryCondition = filter;
		} else if (item.attrcode == FIELD.pk_dept_v) {
			item.queryCondition = () => {
				let orgs = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return {
					pk_org: orgs,
					busifuncode: FIELD.PURCHASEORG
				};
			};
		} else if (item.attrcode == FIELD.pk_dept) {
			item.queryCondition = () => {
				let orgs = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return {
					pk_org: orgs,
					busifuncode: FIELD.PURCHASEORG
				};
			};
		} else if (item.attrcode == FIELD.cemployeeid) {
			// 原nc的业务员的编辑前事件是根据采购组织和采购部门参照过滤的
			item.queryCondition = () => {
				let orgs = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				let pk_dept = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_dept).value;
				return {
					pk_org: orgs,
					pk_dept: pk_dept,
					busifuncode: FIELD.PURCHASEORG
				};
			};
		} else if (item.attrcode == FIELD.pk_bankdoc) {
			// 银行账户根据开票供应商和币种参照过滤,完全采用平台过滤，客户传供应商
			item.queryCondition = () => {
				item.label = getLangByResId(this, '4004POORDER-000061'); /* 国际化处理： 供应商银行账户*/
				item.itemtype = 'refer';
				item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index';
				let pk_bankdoc = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_bankdoc).value;
				let pk_supplier = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_supplier).value;
				let corigcurrencyid = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.corigcurrencyid)
					.value;
				return {
					accclass: '3',
					pk_cust: pk_supplier,
					pk_supplier: pk_supplier //,
					//pk_currtype: corigcurrencyid
					// GridRefActionExt: 'nccloud.web.pu.order.ref.AccountBankRefFilter'
				};
			};
		} else if (item.attrcode == FIELD.pk_deliveradd) {
			//供应商发货地址,供应商为空时不允许编辑
			item.queryCondition = () => {
				let pk_supplier = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_supplier).value;
				let pk_org = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				if (pk_supplier != null) {
					return {
						pk_org: pk_org,
						pk_supplier: pk_supplier
						//GridRefActionExt: 'nccloud.web.pu.order.ref.DeliveraddRefFilter'
					};
				}
			};
		} else {
			item.queryCondition = () => {
				let data = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return { pk_org: data }; // 根据pk_org过滤
			};
		}
	});
	meta[PAGECODE.cardbody].items.map((item) => {
		if (item.attrcode == FIELD.pk_material) {
			item.isMultiSelectedEnabled = true;
		}
		if (item.attrcode != FIELD.pk_org_v && item.attrcode != FIELD.pk_org) {
			item.queryCondition = () => {
				let org = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return { pk_org: org };
			};
		}
		if (item.attrcode == 'pk_reqdept_v') {
			item.queryCondition = () => {
				let org = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return {
					pk_org: org,
					busifuncode: FIELD.STOCKORG
				};
			};
		}
	});
	meta[PAGECODE.childform2].items.map((item) => {
		if (item.attrcode == FIELD.pk_material) {
			item.isMultiSelectedEnabled = true;
		}
		if (item.attrcode != FIELD.pk_org_v && item.attrcode != FIELD.pk_org) {
			item.queryCondition = () => {
				let org = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return { pk_org: org };
			};
		}
		if (item.attrcode == 'pk_reqdept_v') {
			item.queryCondition = () => {
				let org = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return {
					pk_org: org,
					busifuncode: FIELD.STOCKORG
				};
			};
		}
	});
	// 冻结不要操作列
	let scene = _this.props.getUrlParam('scene');
	if (scene != 'freeze') {
		//付款协议操作列
		let pay_event = {
			label: getLangByResId(this, '4004POORDER-000008') /* 国际化处理： 操作*/,
			attrcode: 'opr',
			width: '200px',
			itemtype: 'customer', //默认必输
			visible: true,
			fixed: 'right', //右侧锁定操作列
			render: (text, record, index) => {
				let buttonAryp = buttonController.getPayMentOprButton(this.props);
				return this.props.button.createOprationButton(buttonAryp, {
					area: PAGECODE.payment_table_row,
					buttonLimit: 3,
					onButtonClick: (props, key) => buttonClickController.call(this, props, key, text, record, index)
				});
			}
		};
		//物料操作列
		let material_event = {
			label: getLangByResId(this, '4004POORDER-000008') /* 国际化处理： 操作*/,
			itemtype: 'customer',
			attrcode: 'opr',
			width: '200px',
			visible: true,
			fixed: 'right',
			render: (text, record, mindex) => {
				let buttonAry = buttonController.getMaterialOprButtons.call(this, this.props, record);
				return this.props.button.createOprationButton(buttonAry, {
					area: PAGECODE.material_table_row,
					buttonLimit: 3,
					onButtonClick: (props, key) => buttonClickController.call(this, props, key, text, record, mindex)
				});
			}
		};
		meta[PAGECODE.cardbody].items.push(material_event);
		meta[PAGECODE.head_payment].items.push(pay_event);
	}
	// 行号排序：付款协议表体和物料表体
	columnSortUtils.numberSort(meta, PAGECODE.head_payment, 'showorder');
	columnSortUtils.numberSort(meta, PAGECODE.cardbody, FIELD.crowno);
	return meta;
}

function toggleShow(data) {
	// 修改页面状态
	let status = this.props.getUrlParam(STATUS.status);
	let pk = this.props.getUrlParam(FIELD.id);
	let vsrctype = this.props.getUrlParam('vsrctype');
	if (vsrctype == null) {
		vsrctype = this.props.getUrlParam('transfer');
	}
	vsrctype = vsrctype == 'undefined' ? null : vsrctype; //推单
	let id = pk == null || pk.length == 0 ? false : pk;
	// 新增
	let pk_org_v = data.context.pk_org_v;
	let org_v_Name = data.context.org_v_Name;
	// 缓存为了处理卡片的自制
	setDefData(OrderCache.OrderCardCache, FIELD.pk_org_v, pk_org_v);
	setDefData(OrderCache.OrderCardCache, 'pk_org_v_name', org_v_Name);
	if ((!status || status == 'edit') && !id && vsrctype == null) {
		if (pk_org_v) {
			let changeRow = { refpk: pk_org_v, refname: org_v_Name };
			let obj_pk_org_v = { value: pk_org_v, display: org_v_Name, scale: '-1' };
			this.props.form.setFormItemsValue(PAGECODE.cardhead, { [FIELD.pk_org_v]: obj_pk_org_v });
			afterEvents.call(this, this.props, PAGECODE.cardhead, FIELD.pk_org_v, obj_pk_org_v, changeRow);
		}
		buttonController.togglePageShow.call(this, this.props, null, pk_org_v);
		this.props.form.setFormItemsDisabled(PAGECODE.cardhead, { pk_org_v: false });
	} else if (status == 'copy') {
		copyAddBtn.call(this);
	} else {
		if (vsrctype == null) {
			if (pk_org_v) {
				let changeRow = { refpk: pk_org_v, refname: org_v_Name };
				let obj_pk_org_v = { value: pk_org_v, display: org_v_Name, scale: '-1' };
				this.props.form.setFormItemsValue(PAGECODE.cardhead, { [FIELD.pk_org_v]: obj_pk_org_v });
				afterEvents.call(this, this.props, PAGECODE.cardhead, FIELD.pk_org_v, obj_pk_org_v, changeRow);
			}
			buttonController.togglePageShow.call(this, this.props, null);
		} else {
			this.props.button.hideButtonsByAreas([ PAGECODE.cardhead ]);
		}
	}
	pageInfoClick.call(this);
}
