/*
 * @Author: CongKe
 * @PageInfo: 初始化到货订单模板
 * @Date: 2018-06-13 14:17:31
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-08-22 11:21:41
 */
import { PAGECODE, PAGEAREA } from '../const';
import { TRANSFERMULTI } from '../../constance/index';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';

export default function() {
	let _this = this;
	this.props.createUIDom(
		{
			pagecode: PAGECODE.pagecode23,
			appcode: PAGECODE.appcode23,
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modify.call(_this, _this.props, meta);
					_this.templet23id = data.template.pageid;
					_this.oid23 = data.template[PAGEAREA.search23].oid;
					_this.props.meta.addMeta(meta);
				}
				let button = [
					{
						id: 'Refresh_id',
						type: 'general_btn',
						key: 'refresh',
						area: PAGEAREA.headall,
						order: '1',
						children: [],
					},
				];
				_this.props.button.setButtons(button);
			}
		}
	);
}

function modify(props, meta) {
	meta[PAGEAREA.search23].items.map((item, index) => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		if (item.attrcode == 'cunitid') {
			let outIndex23 = index;
		}
		if (item.attrcode == 'pk_purchaseorg') {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		}
		if (item.attrcode != 'pk_org' && item.attrcode != 'pk_purchaseorg') {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGEAREA.search23, 'pk_purchaseorg');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'pk_pupsndoc') {
			// 采购员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGEAREA.search23, 'pk_purchaseorg');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(PAGEAREA.search23, 'pk_dept');
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'pu',
				};
			};
		} else if (item.attrcode == 'pk_dept') {
			// 部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGEAREA.search23, 'pk_purchaseorg');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu',
				};
			};
		}
	});
	// 拉单的超链接
	meta[PAGEAREA.head23] &&
		meta[PAGEAREA.head23].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFERMULTI.billtype23,
				billcodefield: TRANSFERMULTI.vbillcode,
				pkfield: TRANSFERMULTI.pk_arriveorder,
			});
		});
	meta[PAGEAREA.VIEW23] &&
		meta[PAGEAREA.VIEW23].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFERMULTI.billtype23,
				billcodefield: TRANSFERMULTI.vbillcode,
				pkfield: TRANSFERMULTI.pk_arriveorder,
			});
		});
	return meta;
}
