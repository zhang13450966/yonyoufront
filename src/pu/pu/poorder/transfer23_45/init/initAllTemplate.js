/*
 * @Author: CongKe
 * @PageInfo: 初始化全部模板
 * @Date: 2018-06-13 14:17:31
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-04-26 10:28:20
 */
import { PAGECODE, PAGEAREA } from '../const';
import { TRANSFERMULTI } from '../../constance/index';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';

export default function() {
	let _this = this;
	this.props.createUIDom(
		{
			pagecode: PAGECODE.pagecodeall,
			appcode: PAGECODE.appcodeall,
		},
		function(data) {
			if (data) {
				if (data.template) {
					let appcode = _this.props.getSearchParam('c');
					_this.srcappcode = appcode;
					let meta = data.template;
					modify.call(_this, meta);
					_this.templetallid = data.template.pageid;
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

	// ajax({
	// 	url: '/nccloud/platform/pub/mergerequest.do',
	// 	data: [
	// 		{
	// 			rqUrl: '/platform/templet/querypage.do', //list
	// 			rqJson: `{ pagecode:${PAGECODE.pagecodeall},appcode:${PAGECODE.appcodeall}}`,
	// 			rqCode: 'all'
	// 		}
	// 		// {
	// 		// 	rqUrl: '/platform/templet/querypage.do', //23
	// 		// 	rqJson: `{ pagecode:${PAGECODE.pagecode23} , appcode: ${PAGECODE.appcode23}}`,
	// 		// 	rqCode: 'arrive'
	// 		// },
	// 		// {
	// 		// 	rqUrl: '/platform/templet/querypage.do', //45
	// 		// 	rqJson: `{ pagecode:${PAGECODE.pagecode45} , appcode: ${PAGECODE.appcode45}}`,
	// 		// 	rqCode: 'purchasein'
	// 		// }
	// 	],
	// 	success: (res) => {
	// 		if (res && res.success) {
	// 			// this.templet23id = res.data.arrive.pageid;
	// 			// this.templet45id = res.data.purchasein.pageid;
	// 			// this.oid23 = res.data.arrive[PAGEAREA.search23].oid;
	// 			// this.oid45 = res.data.purchasein[PAGEAREA.search45].oid;
	// 			let nmeta = res.data;
	// 			let scene = this.props.getUrlParam('scene');
	// 			this.setState({ scene: scene });
	// 			nmeta = modify.call(this, nmeta); // 这个顺序
	// 			meta.setMeta(nmeta.all);
	// 			meta.addMeta(nmeta.arrive);
	// 			meta.addMeta(nmeta.purchasein);
	// 			let button = [
	// 				{
	// 					id: 'Refresh_id',
	// 					type: 'button_secondary',
	// 					key: 'refresh',
	// 					area: PAGEAREA.headall,
	// 					order: '1',
	// 					children: []
	// 				}
	// 			];
	// 			_this.props.button.setButtons(button);
	// 		}
	// 	}
	// });
}

function modify(meta) {
	let _this = this;
	meta[PAGEAREA.searchall] &&
		meta[PAGEAREA.searchall].items.map((item, index) => {
			setRefShowDisabledData(item);
			setPsndocShowLeavePower(item);
			if (item.attrcode != 'pk_org' && item.attrcode != 'pk_purchaseorg') {
				item.isShowUnit = true;
				// 根据pk_org过滤
				item.queryCondition = () => {
					let data = _this.props.search.getSearchValByField(PAGEAREA.searchall, 'pk_purchaseorg');
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					return { pk_org: data };
				};
			}
			if (item.attrcode == 'pk_purchaseorg') {
				//主组织权限过滤
				item.queryCondition = () => {
					return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
				};
			} else if (item.attrcode == 'pk_pupsndoc') {
				// 采购员
				item.queryCondition = () => {
					let data = _this.props.search.getSearchValByField(PAGEAREA.searchall, 'pk_purchaseorg');
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					let pk_dept = _this.props.search.getSearchValByField(PAGEAREA.searchall, 'pk_dept');
					pk_dept =
						pk_dept != null
							? pk_dept.value.firstvalue.includes(',')
								? null
								: pk_dept.value.firstvalue
							: null;
					return {
						pk_org: data,
						pk_dept: pk_dept,
						busifuncode: 'pu',
					};
				};
			} else if (item.attrcode == 'pk_dept') {
				// 部门
				item.queryCondition = () => {
					let data = _this.props.search.getSearchValByField(PAGEAREA.searchall, 'pk_purchaseorg');
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					return {
						pk_org: data,
						busifuncode: 'pu',
					};
				};
			} else if (item.attrcode == 'cunitid') {
				let outIndexall = index;
			}
		});
	meta.arrive &&
		meta.arrive[PAGEAREA.search23].items.map((item, index) => {
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
					let data = _this.props.search.getSearchValByField(PAGEAREA.search23, 'pk_purchaseorg');
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					return { pk_org: data };
				};
			} else if (item.attrcode == 'pk_pupsndoc') {
				// 采购员
				item.queryCondition = () => {
					let data = _this.props.search.getSearchValByField(PAGEAREA.search23, 'pk_purchaseorg');
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					let pk_dept = _this.props.search.getSearchValByField(PAGEAREA.search23, 'pk_dept');
					pk_dept =
						pk_dept != null
							? pk_dept.value.firstvalue.includes(',')
								? null
								: pk_dept.value.firstvalue
							: null;
					return {
						pk_org: data,
						pk_dept: pk_dept,
						busifuncode: 'pu',
					};
				};
			} else if (item.attrcode == 'pk_dept') {
				// 部门
				item.queryCondition = () => {
					let data = _this.props.search.getSearchValByField(PAGEAREA.search23, 'pk_purchaseorg');
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					return {
						pk_org: data,
						busifuncode: 'pu',
					};
				};
			}
		});
	meta.purchasein &&
		meta.purchasein[PAGEAREA.search45].items.map((item, index) => {
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
					let data = _this.props.search.getSearchValByField(PAGEAREA.search45, 'cpurorgoid');
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					return { pk_org: data };
				};
			} else if (item.attrcode == 'cbizid') {
				// 采购员
				item.queryCondition = () => {
					let data = _this.props.search.getSearchValByField(PAGEAREA.search23, 'cpurorgoid');
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					let pk_dept = _this.props.search.getSearchValByField(PAGEAREA.search23, 'cdptid');
					pk_dept =
						pk_dept != null
							? pk_dept.value.firstvalue.includes(',')
								? null
								: pk_dept.value.firstvalue
							: null;
					return {
						pk_org: data,
						pk_dept: pk_dept,
						busifuncode: 'pu',
					};
				};
			} else if (item.attrcode == 'cdptid') {
				// 部门
				item.queryCondition = () => {
					let data = _this.props.search.getSearchValByField(PAGEAREA.search23, 'cpurorgoid');
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					return {
						pk_org: data,
						busifuncode: 'pu',
					};
				};
			}
		});
	// 超链接
	meta[PAGEAREA.headall] &&
		meta[PAGEAREA.headall].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(
				_this,
				_this.props,
				item,
				{
					billtypefield: 'cbilltypeid',
					billcodefield: 'vbillcode',
				},
				true
			);
		});
	meta[PAGEAREA.VIEWALL] &&
		meta[PAGEAREA.VIEWALL].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(
				_this,
				_this.props,
				item,
				{
					billtypefield: 'cbilltypeid',
					billcodefield: 'vbillcode',
				},
				true
			);
		});
	meta.arrive &&
		meta.arrive[PAGEAREA.head23].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(_this, _this.props, item, {
				billtype: TRANSFERMULTI.billtype23,
				billcodefield: TRANSFERMULTI.vbillcode,
				pkfield: TRANSFERMULTI.pk_arriveorder,
			});
		});
	meta.purchasein &&
		meta.purchasein[PAGEAREA.head45].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(_this, _this.props, item, {
				billtype: TRANSFERMULTI.billtype45,
				billcodefield: TRANSFERMULTI.vbillcode,
				pkfield: TRANSFERMULTI.cgeneralhid,
			});
		});
	return meta;
}
