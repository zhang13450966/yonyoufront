/*
 * @Author: CongKe
 * @PageInfo: 采购订单列表态初始化
 * @Date: 2018-04-19 10:12:36
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-24 12:32:39
 */
import { URL, PAGECODE, FIELD, STATUS, BUTTON, PAYPLANDATASOURCE } from '../../constance';
import { pageinfo, pageInfoQuery } from '../btnClicks';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonClickController, buttonController } from '../viewController/index';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
import BillCodeHyperLink from '../../../../../scmpub/scmpub/components/BillCodeStyle';

export default function(props) {
	let _this = this;
	this.props.createUIDom(
		{
			pagecode: PAGECODE.listcode
		},
		callbackFun
	);
	function callbackFun(templedata) {
		if (templedata) {
			let templetid = templedata.template && templedata.template.pageid;
			setDefData(PAYPLANDATASOURCE.PAYPLANCACHE, PAGECODE.templetid, templetid);
			if (templedata.template) {
				let meta = templedata.template;
				meta = modifier.call(_this, meta, props);
				props.meta.setMeta(meta, toggleShow.bind(_this, props));
			}
			if (templedata.button) {
				let button = templedata.button;
				props.button.setButtons(button);
			}
			setDefaultData.call(this, props);
		}
	}
}
/**
 * 列表数据后处理修饰
 * @param  meta
 * @param {*} props
 */
function modifier(meta, props) {
	let _this = this;
	//编辑前 参照过滤
	meta[PAGECODE.searchId].items.map((item) => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		if (item.attrcode == FIELD.pk_org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
		if (item.attrcode == 'pk_dept') {
			// 部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode == 'cemployeeid') {
			// 采购员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(PAGECODE.searchId, 'pk_dept');
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode == FIELD.vordertrantype) {
			//订单类型过滤交易类型
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
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
		} else {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu'
				};
			};
		}
	});
	let event = {
		label: getLangByResId(_this, '4004OPAYPLAN-000016') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '150px',
		visible: true,
		fixed: 'right',
		render: (text, record, mindex) => {
			let buttonAry = [];

			let status = this.props.editTable.getStatus(PAGECODE.tableId);
			if (status == STATUS.edit) {
				buttonAry = [ BUTTON.List_Inner_Insert, BUTTON.List_Inner_Delete, BUTTON.List_Inner_Copy ];
			}

			return props.button.createErrorButton({
				record: record,
				showBack: false, // 是否显示回退按钮
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry, {
						area: PAGECODE.tableArea,
						buttonLimit: 3,
						onButtonClick: (props, key) =>
							buttonClickController.call(this, props, key, text, record, mindex)
					});
				}
			});
		}
	};
	meta[PAGECODE.tableId].items.push(event);
	columnSortUtils.numberSort(meta, PAGECODE.tableId, 'crowno');

	//模板table的订单编号列加超链接
	meta[PAGECODE.tableId] &&
		meta[PAGECODE.tableId].items.map((item, index) => {
			transferSkipToPayPlanUtil.call(this, this.props, item, {
				billtype: '21',
				billcodefield: FIELD.vordercode,
				pkfield: FIELD.pk_order
			});
		});

	return meta;
}

function toggleShow(props) {
	let pk = props.getUrlParam(FIELD.id);
	let srcpks = this.props.getUrlParam(FIELD.pk);
	if (srcpks) {
		srcpks = JSON.parse(srcpks);
		let pk_org = props.getUrlParam(FIELD.pk_org);
		let vbillcode = props.getUrlParam(FIELD.vbillcode);
		debugger;
		if (pk_org && vbillcode) {
			let pk_orgnew = JSON.parse(pk_org);
			props.search.setSearchValByField(PAGECODE.searchId, FIELD.pk_org, pk_orgnew);
			props.search.setSearchValByField(PAGECODE.searchId, FIELD.vordercode, { value: vbillcode });
		}
		pageInfoQuery.call(this, props, srcpks);
	}
	if (pk) {
		//根据pk加载数据
		pageinfo.call(this, props, pk);
	}
	buttonController.togglePageShow.call(this, props, STATUS.browse);
}
function setDefaultData(props) {
	let pk_org = props.getUrlParam(FIELD.pk_org);
	let vbillcode = props.getUrlParam(FIELD.vbillcode);
	let dbilldate = props.getUrlParam(FIELD.dbilldate);
	debugger;
	if (pk_org && vbillcode && dbilldate) {
		props.search.setSearchValByField(PAGECODE.searchId, FIELD.pk_org, JSON.parse(pk_org));
		props.search.setSearchValByField(PAGECODE.searchId, FIELD.vordercode, { value: vbillcode });
		// 查询区查询条件赋值，开始时间为单据日期0点0分0秒，结束时间为单据日期23点59分59秒，否则查询时只能查到单据日期那一时刻的数据
		let startDate = dbilldate.substr(0, 10) + ' 00:00:00';
		let endDate = dbilldate.substr(0, 10) + ' 23:59:59';
		props.search.setSearchValByField(PAGECODE.searchId, FIELD.vorderbilldate, {
			value: startDate + ',' + endDate
		});
	}
}

function transferSkipToPayPlanUtil(props, item, config, isAllPage = false) {
	const { billtype, billcodefield = 'vordercode', pkfield } = config;
	if (item.attrcode == billcodefield) {
		item.width = 150;
		item.renderStatus = 'browse';
		item.render = (text, record, index) => {
			return (
				<BillCodeHyperLink
					value={record && record.values[billcodefield] && record.values[billcodefield].value}
					onClick={() => {
						if (billtype && record.values[pkfield]) {
							props.openTo(null, {
								billtype: billtype,
								sence: 4,
								status: 'browse',
								id: record.values[pkfield].value
							});
						}
					}}
				/>
			);
		};
		return item;
	}
}
