/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，拉单页面初始化
 * @Date: 2021-11-19 14:44:04 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-26 13:21:19
 */
import { PAGECODE, APPCODE, AREA, COMMON } from '../../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import addRefresh from '../../utils/addRefresh';

export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			appcode: APPCODE.poorder21P, //应用编码
			pagecode: PAGECODE.ref25_list //卡片页面编码
		},
		(data) => {
			if (data) {
				// 模板
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(_this, _this.props, meta);
					_this.props.meta.setMeta(meta, () => {
						data.template.pageid &&
							_this.setState({
								templetid_21P: data.template.pageid
							});
						_this.templetid_21P = data.template.pageid;
						setDefaultData.call(_this, _this.props);
					});
				}
				// 按钮
				// if (data.button) {
				// 	let button = data.button;
				// 	props.button.setButtons(button);
				// }
			}
		}
	);
	addRefresh(_this.props);
}

/**
 * 自定义元数据样式
 * @param {*} props
 * @param {*} meta
 */
function modifierMeta(props, meta) {
	// 设置固定宽度 撑开子表
	meta[AREA.search25].items.map((item) => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		// item.width = 120;
		if (item.attrcode == 'pk_order_payplan_b.pk_psfinanceorg') {
			//主组织过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'pk_org') {
			//主组织权限过滤
			item.queryCondition = () => {
				return {
					GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter',
					DataPowerOperationCode: 'SCMDefault'
				};
			};
		} else if (item.attrcode == 'vordertrantype') {
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(AREA.search25, 'pk_org');
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
		} else if (item.attrcode == 'cemployeeid') {
			// 采购员
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.search25, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(AREA.search25, 'pk_dept');
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'st'
				};
			};
		} else if (item.attrcode == 'pk_dept') {
			// 计划部门
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.search25, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				data = data == '' ? null : data;
				return {
					pk_org: data,
					busifuncode: 'st'
				};
			};
		} else if (item.attrcode != 'pk_org') {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.search25, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
		return item;
	});

	// 拉单的超链接
	meta[AREA.head25] &&
		meta[AREA.head25].items.map((item, index) => {
			transferSkipToPayPlanUtil.call(this, props, item, {
				billtype: '21P', //采购订单付款计划
				pkfield: COMMON.pk_order,
				billcodefield: COMMON.vordercode
			});
		});
	meta[AREA.view25] &&
		meta[AREA.view25].items.map((item, index) => {
			transferSkipToPayPlanUtil.call(this, props, item, {
				billtype: '21P', //采购订单付款计划
				pkfield: COMMON.pk_order,
				billcodefield: COMMON.vordercode
			});
		});
	return meta;
}

function transferSkipToPayPlanUtil(props, item, config, isAllPage = false) {
	const { billtype, billcodefield, pkfield } = config;
	if (item.attrcode == billcodefield) {
		item.width = 150;
		item.renderStatus = 'browse';
		item.render = (text, record, index) => {
			return (
				<a
					style={{ cursor: 'pointer' }}
					onClick={(e) => {
						if (billtype && record[pkfield]) {
							props.openTo(COMMON.payplanlist, {
								appcode: COMMON.payplanappcode,
								pagecode: COMMON.payplanpagecode,
								pk_org: JSON.stringify(record[COMMON.pk_org]),
								vbillcode: record[COMMON.vordercode].value,
								status: 'browse',
								id: record[pkfield].value,
								dbilldate: record['vorderbilldate'].value
							});
						}
					}}
				>
					{!record[billcodefield].display ? record[billcodefield].value : record[billcodefield].display}
				</a>
			);
		};
		return item;
	}
}

function setDefaultData(props) {
	let initData = props.initData;
	if (initData && initData.cfanaceorgoid && initData.cfanaceorgoid.value && props.isRefAddLine) {
		// 结算财务组织
		props.search.setSearchValByField(AREA.search25, 'po_order_payplan_b.pk_psfinanceorg', initData.cfanaceorgoid);
		props.search.setSearchValByField(
			AREA.search25,
			'po_order_payplan_b.pk_psfinanceorg',
			initData.cfanaceorgoid,
			'normal'
		);
		props.search.setSearchValByField(
			AREA.search25,
			'po_order_payplan_b.pk_psfinanceorg',
			initData.cfanaceorgoid,
			'super'
		);
		props.search.setDisabledByField(AREA.search25, 'po_order_payplan_b.pk_psfinanceorg', true);
	} else {
		props.search.setSearchValByField(AREA.search25, 'po_order_payplan_b.pk_psfinanceorg', null);
		props.search.setDisabledByField(AREA.search25, 'po_order_payplan_b.pk_psfinanceorg', false);
	}

	if (initData && initData.pk_purchaseorg && initData.pk_purchaseorg.value && props.isRefAddLine) {
		// 采购组织
		props.search.setSearchValByField(AREA.search25, 'pk_org', initData.pk_purchaseorg);
		props.search.setSearchValByField(AREA.search25, 'pk_org', initData.pk_purchaseorg, 'normal');
		props.search.setSearchValByField(AREA.search25, 'pk_org', initData.pk_purchaseorg, 'super');
		props.search.setDisabledByField(AREA.search25, 'pk_org', true);
	} else {
		props.search.setSearchValByField(AREA.search25, 'pk_org', null);
		props.search.setDisabledByField(AREA.search25, 'pk_org', false);
	}

	if (initData && initData.pk_supplier && initData.pk_supplier.value && props.isRefAddLine) {
		// 供应商
		props.search.setSearchValByField(AREA.search25, 'cvendorid', initData.pk_supplier);
		props.search.setSearchValByField(AREA.search25, 'cvendorid', initData.pk_supplier, 'normal');
		props.search.setSearchValByField(AREA.search25, 'cvendorid', initData.pk_supplier, 'super');
		props.search.setDisabledByField(AREA.search25, 'cvendorid', true);
	} else {
		props.search.setSearchValByField(AREA.search25, 'cvendorid', null);
		props.search.setDisabledByField(AREA.search25, 'cvendorid', false);
	}
}
