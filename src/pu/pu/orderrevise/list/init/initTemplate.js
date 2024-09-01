/*
 * @Author: CongKe
 * @PageInfo: 采购订单列表态初始化
 * @Date: 2018-04-19 10:12:36
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:48:21
 */
import { URL, PAGECODE, FIELD, STATUS, LIST_BUTTON, OrderReviseCache } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { buttonClickController, buttonController } from '../viewController/index';
import BillCodeHyperLink from 'scmpub/scmpub/components/BillCodeStyle';

export default function() {
	this.props.createUIDom(
		{
			pagecode: PAGECODE.listcode
		},
		(templedata) => {
			if (templedata.template) {
				let meta = templedata.template;
				meta = modifier.call(this, meta, this.props);
				this.props.meta.setMeta(meta, toggleShow.call(this));
			}
			if (templedata.button) {
				let button = templedata.button;
				this.props.button.setButtons(button);
				this.props.button.setPopContent(
					LIST_BUTTON.Delete,
					getLangByResId(this, '4004ORDERREVISE-000033')
				); /* 国际化处理： 确认删除？*/
			}
		}
	);
}
/**
 * 列表数据后处理修饰
 * @param  meta
 * @param {*} props
 */
function modifier(meta, props) {
	let listTableMeta = meta[PAGECODE.list_head];
	//修改编辑前参照过滤
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
		if (item.attrcode == 'pk_reqdept_v') {
			//需求部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: FIELD.STOCKORG
				};
			};
		} else if (item.attrcode == FIELD.ctrantypeid) {
			//订单类型过滤交易类型
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
		} else if (item.attrcode == FIELD.pk_dept) {
			// 部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu'
				};
			};
		} else if (item.attrcode == FIELD.cemployeeid) {
			// 采购员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_dept);
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'pu'
				};
			};
		}
	});
	//模板table的订单编号列加超链接
	listTableMeta.items = listTableMeta.items.map((item, key) => {
		if (item.attrcode == FIELD.vbillcode) {
			item.render = (text, record, index) => {
				//取值前需先判断record是否为空，避免没有数据的情况报错
				let pk_order = record && record.pk_order && record.pk_order.value;
				return (
					<BillCodeHyperLink
						value={record && record.vbillcode && record.vbillcode.value}
						onClick={() => {
							this.props.pushTo(URL.gotoCard, {
								status: STATUS.browse,
								id: pk_order,
								pagecode: PAGECODE.cardcode
							});
						}}
					/>
				);
			};
		}
		return item;
	});
	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4004ORDERREVISE-000014') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '250px',
		visible: true,
		render: (text, record, index) => {
			// 当存在修订历史才显示操作“查看修订记录”，否则不显示； 采购订单表头字段版本号大于1的即代表已修订
			let buttonAry = buttonController.getListRowButtons.call(this, record);
			return props.button.createOprationButton(buttonAry, {
				area: PAGECODE.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClickController.call(this, props, key, text, record, index)
			});
		}
	};
	meta[PAGECODE.list_head].items.push(event);
	return meta;
}

function toggleShow() {
	setTimeout(() => {
		buttonController.initButtons.call(this);
	}, 0);
}
