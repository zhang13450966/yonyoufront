/*
 * @Author: CongKe
 * @PageInfo: 采购订单拉请购单初始化
 * @Date: 2018-06-13 14:12:29
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-15 16:20:25
 */
import { ajax, base } from 'nc-lightapp-front';
import { TRANSFER20, OrderCache } from '../../constance';
import { searchBtnClick } from '../btnClick';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';

export default function() {
	let _this = this;
	this.props.createUIDom(
		{
			pagecode: TRANSFER20.PAGEID,
			appcode: TRANSFER20.appcode
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(_this, _this.props, meta);
					_this.props.meta.setMeta(meta, () => {
						data.template.pageid &&
							_this.setState({
								templetid: data.template.pageid
							});
						setTimeout(() => {
							let scene = _this.props.getUrlParam('scene');
							if (scene) {
								searchBtnClick.call(_this, scene);
							}
						}, 0);
						setDefaultData.call(_this, _this.props);
					});
				}
				let button = [
					{
						id: 'Quota_Allocation_id',
						type: 'general_btn',
						key: TRANSFER20.Quota_Allocation,
						title: getLangByResId(_this, '4004POORDER-000083') /* 国际化处理： 配额分配*/,
						area: TRANSFER20.PAGEID,
						order: '1',
						children: []
					},
					{
						id: 'Supplier_id',
						type: 'general_btn',
						key: TRANSFER20.Supplier,
						title: getLangByResId(_this, '4004POORDER-000084') /* 国际化处理： 确认供应商*/,
						area: TRANSFER20.PAGEID,
						order: '2',
						children: []
					},
					{
						id: 'Refresh_id',
						type: 'general_btn',
						key: TRANSFER20.Refresh,
						area: TRANSFER20.PAGEID,
						order: '4',
						children: []
					},
					{
						id: 'Quota_Allocation_id',
						type: 'general_btn',
						key: TRANSFER20.Quota_Allocation,
						title: getLangByResId(_this, '4004POORDER-000083') /* 国际化处理： 配额分配*/,
						area: TRANSFER20.PAGEID + 's',
						order: '1',
						children: []
					},
					{
						id: 'Supplier_id',
						type: 'general_btn',
						key: TRANSFER20.Supplier,
						title: getLangByResId(_this, '4004POORDER-000084') /* 国际化处理： 确认供应商*/,
						area: TRANSFER20.PAGEID + 's',
						order: '2',
						children: []
					}
				];
				_this.props.button.setButtons(button);
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
	meta[TRANSFER20.SEARCHID].items.map((item) => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		// item.width = 120;
		if (item.attrcode == 'pk_praybill_b.pk_purchaseorg') {
			//主组织权限过滤
			item.queryCondition = () => {
				return {
					GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter',
					DataPowerOperationCode: 'SCMDefault'
				};
			};
		} else if (item.attrcode == 'pk_praybill_b.cordertrantypecode') {
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(TRANSFER20.SEARCHID, 'pk_praybill_b.pk_purchaseorg');
				pk_org =
					pk_org != null ? (pk_org.value.firstvalue.includes(',') ? null : pk_org.value.firstvalue) : null;
				//订单类型过滤交易类型
				return {
					istransaction: 'Y',
					parentbilltype: '21',
					SCM_CONSIDERBUSITYPE: 'Y',
					pk_org: pk_org,
					SCM_BUSIORG: pk_org,
					UsualGridRefActionExt: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
				};
			};
		} else if (item.attrcode == 'pk_planpsn') {
			// 计划员
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER20.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(TRANSFER20.SEARCHID, 'pk_plandept');
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'st'
				};
			};
		} else if (item.attrcode == 'pk_plandept') {
			// 计划部门
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER20.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				data = data == '' ? null : data;
				return {
					pk_org: data,
					busifuncode: 'st'
				};
			};
		} else if (item.attrcode == 'pk_praybill_b.pk_employee') {
			// 采购员
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER20.SEARCHID, 'pk_praybill_b.pk_purchaseorg');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode != 'pk_org') {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER20.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
		return item;
	});
	// 拉单的超链接
	meta[TRANSFER20.LIST_TABLE] &&
		meta[TRANSFER20.LIST_TABLE].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFER20.billtype,
				billcodefield: TRANSFER20.vbillcode,
				pkfield: TRANSFER20.pk_praybill
			});
		});
	meta[TRANSFER20.VIEW] &&
		meta[TRANSFER20.VIEW].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFER20.billtype,
				billcodefield: TRANSFER20.vbillcode,
				pkfield: TRANSFER20.pk_praybill
			});
		});
	return meta;
}

function setDefaultData(props) {
	let initData = getDefData(OrderCache.OrderRefAdd20, 'initData');
	if (initData && initData.pk_org && initData.pk_org.value && props.isRefAddLine) {
		// 采购组织
		props.search.setSearchValByField(TRANSFER20.SEARCHID, 'pk_praybill_b.pk_purchaseorg', initData.pk_org);
		props.search.setSearchValByField(
			TRANSFER20.SEARCHID,
			'pk_praybill_b.pk_purchaseorg',
			initData.pk_org,
			'normal'
		);
		props.search.setSearchValByField(TRANSFER20.SEARCHID, 'pk_praybill_b.pk_purchaseorg', initData.pk_org, 'super');
		props.search.setDisabledByField(TRANSFER20.SEARCHID, 'pk_praybill_b.pk_purchaseorg', true);
	} else {
		// props.search.setSearchValByField(TRANSFER20.SEARCHID, 'pk_praybill_b.pk_purchaseorg', null);
		props.search.setDisabledByField(TRANSFER20.SEARCHID, 'pk_praybill_b.pk_purchaseorg', false);
	}
}
