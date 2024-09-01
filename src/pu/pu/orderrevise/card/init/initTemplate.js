/*
 * @Author: CongKe 
 * @PageInfo: 采购订单卡片态初始化事件
 * @Date: 2018-04-19 10:42:26 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-02-26 09:13:32
 */
import { URL, PAGECODE, FIELD, BUTTON, STATUS } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonClickController, buttonController } from '../viewController/index';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';

export default function() {
	this.props.createUIDom(
		{
			pagecode: PAGECODE.cardcode
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					let meta = templedata.template;
					modifierMeta.call(this, meta, this.props);
					this.props.meta.setMeta(meta, buttonController.togglePageShow.call(this, this.props));
				}
				if (templedata.button) {
					console.log(templedata.button);
					let button = templedata.button;
					this.props.button.hideButtonsByAreas([ PAGECODE.cardhead ]);
					this.props.button.setButtons(button);
					buttonController.togglePageShow.call(this, this.props);
				}
			}
		}
	);
}

function modifierMeta(meta, props) {
	let _this = this;
	let status = props.getUrlParam(STATUS.status);
	meta[PAGECODE.cardhead].status = status;
	meta[PAGECODE.cardbody].status = status;
	//编辑前 参照过滤
	meta[PAGECODE.cardhead].items.map((item) => {
		if (item.attrcode != FIELD.pk_org_v && item.attrcode != FIELD.pk_org) {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return { pk_org: data }; // 根据pk_org过滤
			};
			if (item.attrcode == FIELD.pk_org_v) {
				item.queryCondition = () => {
					return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
				};
			}
			if (item.attrcode == FIELD.ctrantypeid) {
				//订单类型过滤交易类型
				item.queryCondition = () => {
					let pk_org = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
					return {
						istransaction: 'Y',
						parentbilltype: '21',
						SCM_CONSIDERBUSITYPE: 'Y',
						SCM_BUSIORG: pk_org,
						ExRefSqlBuilder: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
					};
				};
			} else if (item.attrcode == FIELD.pk_dept) {
				item.queryCondition = () => {
					let orgs = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
					let pk_dept = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_dept).value;
					return {
						pk_org: orgs,
						pk_dept: pk_dept,
						busifuncode: 'pu'
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
						busifuncode: 'pu'
					};
				};
			} else if (item.attrcode == 'pk_bankdoc') {
				// 银行账户根据开票供应商和币种参照过滤
				item.queryCondition = () => {
					item.label = getLangByResId(this, '4004ORDERREVISE-000013'); /* 国际化处理： 供应商银行账户*/
					item.itemtype = 'refer';
					item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index.js';
					let pk_bankdoc = _this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_bankdoc').value;
					let pk_invcsupllier = _this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_invcsupllier')
						.value;
					let corigcurrencyid = _this.props.form.getFormItemsValue(PAGECODE.cardhead, 'corigcurrencyid')
						.value;
					if (pk_bankdoc != null || pk_invcsupllier != null) {
						return {
							accclass: '3',
							pk_invcsupllier: pk_invcsupllier,
							pk_currtype: corigcurrencyid,
							GridRefActionExt: 'nccloud.web.pu.order.ref.AccountBankRefFilter'
						};
					}
				};
			}
		}
		//币种
	});
	meta[PAGECODE.cardbody].items.map((item) => {
		if (item.attrcode != FIELD.pk_org_v && item.attrcode != FIELD.pk_org) {
			item.queryCondition = () => {
				let org = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return { pk_org: org }; // 根据pk_org过滤
			};
		}
		if (item.attrcode == FIELD.pk_material) {
			item.isMultiSelectedEnabled = true;
		}
	});
	meta[PAGECODE.childform2].items.map((item) => {
		if (item.attrcode != FIELD.pk_org_v && item.attrcode != FIELD.pk_org) {
			item.queryCondition = () => {
				let org = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return { pk_org: org }; // 根据pk_org过滤
			};
		}
		if (item.attrcode == FIELD.pk_material) {
			item.isMultiSelectedEnabled = true;
		}
	});
	//物料操作列
	let material_event = {
		label: getLangByResId(this, '4004ORDERREVISE-000014') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '150px',
		visible: true,
		fixed: 'right',
		render: (text, record, mindex) => {
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
			return this.props.button.createOprationButton(buttonAry, {
				area: PAGECODE.material_table_row,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClickController.call(this, props, key, text, record, mindex)
			});
		}
	};
	meta[PAGECODE.cardbody].items.push(material_event);
	columnSortUtils.numberSort(meta, PAGECODE.cardbody, FIELD.crowno);
	return meta;
}
