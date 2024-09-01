/*
 * @Author: ligangt
 * @PageInfo: 到货单转单列表
 * @Date: 2018-05-25 10:26:08
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-09-12 15:28:24
 */
import { ajax, base } from 'nc-lightapp-front';
import { URL, PAGECODE, COMMON, TRANSFER, AREA, APPCODE } from '../../constance';
import MeasdocDefaultGridRef from '../../../../../uapbd/refer/material/MeasdocDefaultGridRef';
import PsndocTreeGridRef from '../../../../../uapbd/refer/psninfo/PsndocTreeGridRef';
import StorDocDefaulteGridRef from '../../../../../uapbd/refer/stordoc/StorDocDefaulteGridRef';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
let { NCPopconfirm } = base;
export default function() {
	let _this = this;
	_this.props.createUIDom(
		{
			appcode: APPCODE.poorder, //应用编码
			pagecode: PAGECODE.returnOrder, //页面id
		},
		function(data) {
			if (data) {
				if (data.template) {
					_this.setState({
						templetid: data.template.pageid,
					});
					let meta = data.template;
					modifierMeta(_this.props, meta);
					_this.props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					_this.props.button.setButtons(button);
				}
			}
		}
	);
}

/**
 * 自定义元数据样式
 * @param {*} props
 * @param {*} meta
 */
function modifierMeta(props, meta) {
	// 设置固定宽度 撑开子表
	meta[AREA.body].items.map(item => {
		// item.width = 120;
		return item;
	});
	meta[AREA.searchArea].items.map(item => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (item.attrcode == 'ctrantypeid') {
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.searchArea, 'pk_org') || {}).value; // 调用相应组件的取值API)
				return {
					parentbilltype: '21',
					SCM_CONSIDERBUSITYPE: 'Y',
					SCM_BUSIORG: pk_org.firstvalue,
				};
			};
		} else if (item.attrcode == 'pk_order_b.pk_arrvstoorg') {
			//主组织过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (
			item.attrcode != 'pk_org' &&
			item.attrcode != 'pk_order_b.pk_arrvstoorg' &&
			item.attrcode != 'pk_order_b.pk_reqstoorg'
		) {
			if (item.attrcode == 'cemployeeid') {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let data =
						props.search.getSearchValByField(AREA.searchArea, 'pk_org') != null
							? props.search.getSearchValByField(AREA.searchArea, 'pk_org').value.firstvalue
							: null;
					let dept =
						props.search.getSearchValByField(AREA.searchArea, 'pk_dept') != null
							? props.search.getSearchValByField(AREA.searchArea, 'pk_dept').value.firstvalue
							: null;
					return { pk_org: data, pk_dept: dept, busifuncode: 'pu' }; // 根据pk_org过滤
				};
			} else if (item.attrcode == 'pk_dept') {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let data =
						props.search.getSearchValByField(AREA.searchArea, 'pk_org') != null
							? props.search.getSearchValByField(AREA.searchArea, 'pk_org').value.firstvalue
							: null;
					return { pk_org: data, busifuncode: 'pu' }; // 根据pk_org过滤
				};
			} else if (
				item.attrcode == 'billmaker' ||
				item.attrcode == 'approver' ||
				item.attrcode == 'pk_freecust' ||
				item.attrcode == 'pk_transporttype'
			) {
				item.isShowUnit = false;
				item.queryCondition = () => {
					let data =
						props.search.getSearchValByField(AREA.searchArea, 'pk_order_b.pk_arrvstoorg') != null
							? props.search.getSearchValByField(AREA.searchArea, 'pk_order_b.pk_arrvstoorg').value
									.firstvalue
							: null;
					return {
						pk_org: data,
					};
				};
			} else if (item.attrcode == 'pk_order_b.pk_reqstordoc') {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let data =
						props.search.getSearchValByField(AREA.searchArea, 'pk_order_b.pk_reqstoorg') != null
							? props.search.getSearchValByField(AREA.searchArea, 'pk_order_b.pk_reqstoorg').value
									.firstvalue
							: null;
					return {
						pk_org: data,
					};
				};
			} else {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let data =
						props.search.getSearchValByField(AREA.searchArea, 'pk_order_b.pk_arrvstoorg') != null
							? props.search.getSearchValByField(AREA.searchArea, 'pk_order_b.pk_arrvstoorg').value
									.firstvalue
							: null;
					return {
						pk_org: data,
					};
				};
			}
		}
	});
	meta[AREA.head].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '21',
			pkfield: 'pk_order',
		});
	});
	meta[AREA.transferview].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '21',
			pkfield: 'pk_order',
		});
	});
	return meta;
}
