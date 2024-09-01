/*
 * @Author: CongKe 
 * @PageInfo: 订单在途状态公共列表初始化
 * @Date: 2019-04-18 14:40:35 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-05-27 18:22:01
 */
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';

function modifierMeta(props, meta, listTableId, searchId, cardUrl) {
	//修改列渲染样式
	meta[listTableId].items = meta[listTableId].items.map((item, key) => {
		if (item.attrcode == 'vbillcode') {
			item.render = (text, record, index) => {
				if (record && record.vbillcode) {
					return (
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => {
								props.pushTo(cardUrl, {
									id: record.pk_order.value,
									status: 'edit'
								});
							}}
						>
							{record && record.vbillcode && record.vbillcode.value}
						</a>
					);
				}
			};
		}
		return item;
	});
	searchRefFilter.call(this, props, meta, searchId);
	return meta;
}

function searchRefFilter(props, meta, searchId) {
	let pk_org = 'pk_org';
	meta[searchId].items.map((item) => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		if (item.attrcode == pk_org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode != 'pk_order_b.pk_reqstordoc' && item.attrcode != 'pk_order_b.pk_recvstordoc') {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(searchId, pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
		if (item.attrcode == 'pk_reqdept_v') {
			//需求部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(searchId, pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'st'
				};
			};
		} else if (item.attrcode == 'ctrantypeid') {
			//订单类型过滤交易类型
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(searchId, pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				//订单类型过滤交易类型
				return {
					istransaction: 'Y',
					parentbilltype: '21',
					SCM_CONSIDERBUSITYPE: 'Y',
					pk_org: data,
					SCM_BUSIORG: data,
					GridRefActionExt:
						'nccloud.web.pu.order.ref.Vtrantypecode,nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
				};
			};
		} else if (item.attrcode == 'pk_dept') {
			// 部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(searchId, pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode == 'cemployeeid') {
			// 采购员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(searchId, pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(searchId, 'pk_dept');
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode == 'pk_order_b.pk_reqstoorg') {
			//需求库存组织
			item.isShowUnit = false;
		} else if (item.attrcode == 'pk_order_b.pk_arrvstoorg') {
			//收货库存组织
			item.isShowUnit = false;
		} else if (item.attrcode == 'pk_order_b.pk_reqstordoc') {
			//需求仓库
			item.isShowUnit = true;
			item.queryCondition = () => {
				let reqstoorg = props.search.getSearchValByField(searchId, 'pk_order_b.pk_reqstoorg');
				reqstoorg =
					reqstoorg != null
						? reqstoorg.value.firstvalue.includes(',') ? null : reqstoorg.value.firstvalue
						: null;
				return {
					pk_org: reqstoorg,
					busifuncode: 'st'
				};
			};
		} else if (item.attrcode == 'pk_order_b.pk_recvstordoc') {
			//收货仓库
			item.isShowUnit = true;
			item.queryCondition = () => {
				let arrvstoorg = props.search.getSearchValByField(searchId, 'pk_order_b.pk_arrvstoorg');
				arrvstoorg =
					arrvstoorg != null
						? arrvstoorg.value.firstvalue.includes(',') ? null : arrvstoorg.value.firstvalue
						: null;
				return {
					pk_org: arrvstoorg,
					busifuncode: 'st'
				};
			};
		}
	});
}

export { modifierMeta, searchRefFilter };
