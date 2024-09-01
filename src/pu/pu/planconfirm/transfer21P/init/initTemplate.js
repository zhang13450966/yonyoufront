/*
 * @Author: fangmj7
 * @PageInfo: 进度确认单拉采购订单付款计划
 * @Date: 2018-06-13 14:12:29
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-04-18 19:40:36
 */
import { TRANSFER2C, CONSTFIELD } from '../../constance';
import { searchBtnClick } from '../btnClick';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function() {
	let _this = this;
	this.props.createUIDom(
		{
			pagecode: TRANSFER2C.PAGEID,
			appcode: TRANSFER2C.appcode
		},
		(data) => {
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
				if (data.button) {
					let button = data.button;
					this.props.button.setButtons(button);
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
	meta[TRANSFER2C.SEARCHID].items.map((item) => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		// item.width = 120;
		if (item.attrcode == 'pk_org') {
			//主组织权限过滤
			item.queryCondition = () => {
				return {
					GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter',
					DataPowerOperationCode: 'SCMDefault'
				};
			};
		} else if (item.attrcode == 'vordertrantype') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(TRANSFER2C.SEARCHID, 'pk_org');
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
				let data = props.search.getSearchValByField(TRANSFER2C.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(TRANSFER2C.SEARCHID, 'pk_dept');
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
				let data = props.search.getSearchValByField(TRANSFER2C.SEARCHID, 'pk_org');
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
				let data = props.search.getSearchValByField(TRANSFER2C.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
		return item;
	});

	// 拉单的超链接
	meta[TRANSFER2C.LIST_TABLE] &&
		meta[TRANSFER2C.LIST_TABLE].items.map((item, index) => {
			transferSkipToPayPlanUtil.call(this, this.props, item, {
				billtype: TRANSFER2C.billtype,
				billcodefield: TRANSFER2C.vordercode,
				pkfield: TRANSFER2C.pk_order
			});
		});
	meta[TRANSFER2C.VIEW] &&
		meta[TRANSFER2C.VIEW].items.map((item, index) => {
			transferSkipToPayPlanUtil.call(this, this.props, item, {
				billtype: TRANSFER2C.billtype,
				billcodefield: TRANSFER2C.vordercode,
				pkfield: TRANSFER2C.pk_order
			});
		});
	meta[TRANSFER2C.LIST_TABLE_CHILD] &&
		meta[TRANSFER2C.LIST_TABLE_CHILD].items.map((item, index) => {
			transferSkipToPayPlanUtil.call(this, this.props, item, {
				billtype: TRANSFER2C.billtype,
				billcodefield: TRANSFER2C.vordercode,
				pkfield: TRANSFER2C.pk_order
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
				<a
					style={{ cursor: 'pointer' }}
					onClick={(e) => {
						if (billtype && record[pkfield]) {
							props.openTo(TRANSFER2C.payplanlist, {
								appcode: TRANSFER2C.payplanappcode,
								pagecode: TRANSFER2C.payplanpagecode,
								pk_org: JSON.stringify(record[TRANSFER2C.pk_org]),
								vbillcode: record[TRANSFER2C.vordercode].value,
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
	let initData = getDefData(CONSTFIELD.PlanConfirmRefAdd21P, 'initData');
	if (initData && initData.pk_org && initData.pk_org.value && props.isRefAddLine) {
		// 采购组织
		props.search.setSearchValByField(TRANSFER2C.SEARCHID, 'pk_org', initData.pk_org);
		props.search.setSearchValByField(TRANSFER2C.SEARCHID, 'pk_org', initData.pk_org, 'normal');
		props.search.setSearchValByField(TRANSFER2C.SEARCHID, 'pk_org', initData.pk_org, 'super');
		props.search.setDisabledByField(TRANSFER2C.SEARCHID, 'pk_org', true);
	} else {
		// props.search.setSearchValByField(TRANSFER20.SEARCHID, 'pk_praybill_b.pk_purchaseorg', null);
		props.search.setDisabledByField(TRANSFER2C.SEARCHID, 'pk_org', false);
	}
}
