/*
 * 价格结算单拉采购入库单
 * @Author: huoyzh 
 * @Date: 2019-01-15 10:19:08 
 * @Last Modified by: zhanghrh
 * @Last Modified time: 2019-08-24 11:17:50
 */
import { TRANSFER30, TRANSFER30QUERYFIELDS } from '../../constance';
import { setPsndocShowLeavePower } from '../../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
export default function() {
	let _this = this;
	this.props.createUIDom(
		//createUIDom方法用于页面初始化时获取模板、按钮和context信息
		{
			pagecode: TRANSFER30.PAGEID,
			appcode: TRANSFER30.appcode
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(_this, meta, _this.props);
					_this.props.meta.setMeta(meta, () => {
						_this.setState({
							templetid: data.template.pageid
						});
					});
				}
				//定义刷新的按钮
				let button = [
					{
						id: TRANSFER30.Refresh_id,
						type: 'general_btn',
						key: TRANSFER30.Refresh,
						area: TRANSFER30.PAGEID,
						order: TRANSFER30.order,
						children: []
					}
				];
				_this.props.button.setButtons(button);
			}
		}
	);
}
//参照过滤
function modifierMeta(meta, props) {
	meta[TRANSFER30.SEARCHID].items.map((item) => {
		if (item.attrcode == TRANSFER30QUERYFIELDS.cpurorgoid) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == TRANSFER30QUERYFIELDS.pk_org) {
			//库存组织限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.StockOrgRefFilterUtils' };
			};
		} else if (item.attrcode == TRANSFER30QUERYFIELDS.cdptid) {
			//部门
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30.SEARCHID, TRANSFER30QUERYFIELDS.cpurorgoid);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu'
				};
			};
		} else if (
			item.attrcode == TRANSFER30QUERYFIELDS.cmaterialoid ||
			item.attrcode == TRANSFER30QUERYFIELDS.cvendorid
		) {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30.SEARCHID, TRANSFER30QUERYFIELDS.cpurorgoid);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == TRANSFER30QUERYFIELDS.cbizid) {
			//采购员
			item.isShowUnit = true;
			setPsndocShowLeavePower(item); //显示离职人员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30.SEARCHID, TRANSFER30QUERYFIELDS.cpurorgoid);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode == TRANSFER30QUERYFIELDS.cwarehouseid) {
			//仓库
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30.SEARCHID, TRANSFER30QUERYFIELDS.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == TRANSFER30QUERYFIELDS.cwhsmanagerid) {
			//库管员
			item.isShowUnit = true;
			setPsndocShowLeavePower(item);
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30.SEARCHID, TRANSFER30QUERYFIELDS.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'st'
				};
			};
		} else if (item.attrcode == TRANSFER30QUERYFIELDS.ctrantypeid) {
			item.queryCondition = () => {
				let data = TRANSFER30QUERYFIELDS.TYPECODES;
				return {
					parentbilltype: '45'
					// pk_billtypecode: data,
					// GridRefActionExt: 'nccloud.web.pu.pricstl.ref.TransTypeRef'
				};
			};
		}
	});
	meta[TRANSFER30.LIST_TABLE].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '45',
			pkfield: 'cgeneralhid'
		});
	});
	meta[TRANSFER30.VIEW].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '45',
			pkfield: 'cgeneralhid'
		});
	});
	return meta;
}
