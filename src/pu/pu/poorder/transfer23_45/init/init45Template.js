/*
 * @Author: CongKe
 * @PageInfo: 初始化入库订单模板
 * @Date: 2018-06-13 14:17:31
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-08-22 11:22:14
 */
import { PAGECODE, PAGEAREA } from '../const';
import { TRANSFERMULTI } from '../../constance/index';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';

export default function() {
	let _this = this;
	this.props.createUIDom(
		{
			pagecode: PAGECODE.pagecode45,
			appcode: PAGECODE.appcode45,
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modify.call(_this, _this.props, meta);
					_this.templet45id = data.template.pageid;
					_this.oid45 = data.template[PAGEAREA.search45].oid;
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
	meta[PAGEAREA.search45].items.map((item, index) => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		if (item.attrcode == 'cunitid') {
			let outIndex45 = index;
		}
		if (item.attrcode == 'cpurorgoid') {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		}
		if (item.attrcode != 'pk_org' && item.attrcode != 'cpurorgoid') {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGEAREA.search45, 'cpurorgoid');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'cbizid') {
			// 采购员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGEAREA.search23, 'cpurorgoid');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(PAGEAREA.search23, 'cdptid');
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'pu',
				};
			};
		} else if (item.attrcode == 'cdptid') {
			// 部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGEAREA.search23, 'cpurorgoid');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu',
				};
			};
		}
	});
	// 拉单的超链接
	meta[PAGEAREA.head45] &&
		meta[PAGEAREA.head45].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFERMULTI.billtype45,
				billcodefield: TRANSFERMULTI.vbillcode,
				pkfield: TRANSFERMULTI.cgeneralhid,
			});
		});
	meta[PAGEAREA.VIEW45] &&
		meta[PAGEAREA.VIEW45].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFERMULTI.billtype45,
				billcodefield: TRANSFERMULTI.vbillcode,
				pkfield: TRANSFERMULTI.cgeneralhid,
			});
		});
	return meta;
}
