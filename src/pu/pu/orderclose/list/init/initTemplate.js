/*
 * @Author: CongKe 
 * @PageInfo: 采购订单列表态初始化 
 * @Date: 2018-04-19 10:12:36 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-05-13 14:58:55
 */
import { URL, PAGECODE, FIELD, STATUS, BUTTON, ORDERCLOSECACHE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonController } from '../viewController/index';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
import BillCodeHyperLink from 'scmpub/scmpub/components/BillCodeStyle';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';

export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: PAGECODE.listcode
		},
		callbackFun
	);
	function callbackFun(templedata) {
		if (templedata) {
			let templetid = templedata.template && templedata.template.pageid;
			setDefData(ORDERCLOSECACHE.CLOSECACHE, PAGECODE.templetid, templetid);
			if (templedata.template) {
				let meta = templedata.template;
				meta = modifier.call(_this, meta, props);
				props.meta.setMeta(meta);
			}
			if (templedata.button) {
				let button = templedata.button;
				props.button.setButtons(button);
			}
			buttonController.modifyButtonDisabled.call(this, props);
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
	let listTableMeta = meta[PAGECODE.tableId];
	let gridMultiple = {
		list_head: [
			{
				name: getLangByResId(_this, '4004ORDERCLOSE-000020') /* 国际化处理： 到货状态*/,
				code: 'arrivestate',
				children: [ 'naccumarrvnum', 'ncanarrivenum', 'barriveclose' ]
			},
			{
				name: getLangByResId(_this, '4004ORDERCLOSE-000021') /* 国际化处理： 入库状态*/,
				code: 'stockinstate',
				children: [ 'naccumstorenum', 'ncaninnum', 'bstockclose' ]
			},
			{
				name: getLangByResId(_this, '4004ORDERCLOSE-000022') /* 国际化处理： 收票状态*/,
				code: 'invocestate',
				children: [ 'naccuminvoicenum', 'ncaninvoicenum', 'binvoiceclose' ]
			},
			{
				name: getLangByResId(_this, '4004ORDERCLOSE-000025') /* 国际化处理： 付款状态*/,
				code: 'paymentstate',
				children: [ 'nacccancelinvmny', 'nnopayorgmny', 'bpayclose' ]
			}
		]
	};
	meta = props.meta.handleMultiple(meta, gridMultiple);
	//编辑前 参照过滤
	meta[PAGECODE.searchId].items.map((item) => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		if (item.attrcode == FIELD.pk_org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'pk_dept') {
			// 部门
			item.isShowUnit = true;
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
			item.isShowUnit = true;
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
		} else if (item.attrcode != FIELD.pk_org) {
			//  根据pk_org过滤
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	columnSortUtils.numberSort(meta, PAGECODE.tableId, 'crowno');
	//模板table的订单编号列加超链接
	meta[PAGECODE.tableId] &&
		meta[PAGECODE.tableId].items.map((item, index) => {
			transferSkipToPayPlanUtil.call(this, this.props, item, {
				billtype: '21',
				billcodefield: FIELD.vbillcode,
				pkfield: FIELD.pk_order
			});
		});
	return meta;
}

function transferSkipToPayPlanUtil(props, item, config, isAllPage = false) {
	const { billtype, billcodefield = 'vbillcode', pkfield } = config;
	if (item.attrcode == billcodefield) {
		item.width = 150;
		item.renderStatus = 'browse';
		item.render = (text, record, index) => {
			return (
				<BillCodeHyperLink
					value={
						record && record.values && record.values[billcodefield] && record.values[billcodefield].value
					}
					onClick={(e) => {
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
