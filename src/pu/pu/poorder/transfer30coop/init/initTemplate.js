/*
 * @Author: CongKe
 * @PageInfo: 采购订单拉协同销售订单初始化
 * @Date: 2018-06-13 14:12:29
 * @Last Modified by: zhr
 * @Last Modified time: 2021-10-18 11:27:12
 */
import { ajax, base } from 'nc-lightapp-front';
import { TRANSFER30TO21COOP } from '../../constance';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';

export default function() {
	let _this = this;
	let scene = _this.props.getUrlParam('scene');
	let appcode = '';
	if (scene == 'Y') {
		appcode = '400400820';
	} else {
		appcode = TRANSFER30TO21COOP.appcode;
	}
	_this.props.createUIDom(
		{
			pagecode: TRANSFER30TO21COOP.PAGEID,
			appcode: appcode
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					let appcode = _this.props.getSearchParam('c');
					_this.srcappcode = appcode;
					modifierMeta.call(_this, _this.props, meta);
					_this.props.meta.setMeta(meta, () => {
						data.template.pageid &&
							_this.setState({
								templetid: data.template.pageid
							});
					});
				}
				let button = [
					{
						id: 'Refresh_id',
						type: 'general_btn',
						key: TRANSFER30TO21COOP.Refresh,
						area: TRANSFER30TO21COOP.PAGEID,
						order: '1',
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
	meta[TRANSFER30TO21COOP.SEARCHID].items.map((item) => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		// item.width = 120;
		if (item.attrcode == 'pk_org') {
			//主组织权限过滤
		}
		if (item.attrcode == 'pk_org_dest') {
			//主组织权限过滤
			item.queryCondition = () => {
				return {
					GridRefActionExt:
						'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter,nccloud.web.pu.order.ref.CoopPurOrgRefFilter'
					// UsualGridRefActionExt: 'nccloud.web.pu.order.ref.CoopPurOrgRefFilter' //购销协同过滤
				};
			};
		}
		if (item.attrcode != 'pk_org' && item.attrcode != 'pk_org_dest') {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30TO21COOP.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
		if (item.attrcode == 'cemployeeid') {
			// 业务员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30TO21COOP.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(TRANSFER30TO21COOP.SEARCHID, 'cdeptid');
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'st'
				};
			};
		} else if (item.attrcode == 'cdeptid') {
			// 部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30TO21COOP.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'st'
				};
			};
		} else if (item.attrcode == 'ctrantypeid') {
			//订单类型
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30TO21COOP.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					parentbilltype: '30'
				};
				// return {
				// 	istransaction: 'Y',
				// 	parentbilltype: '30',
				// 	SCM_CONSIDERBUSITYPE: 'Y',
				// 	pk_org: data,
				// 	SCM_BUSIORG: data,
				// 	UsualGridRefActionExt: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
				// };
			};
		}
		return item;
	});
	// 拉单的超链接
	meta[TRANSFER30TO21COOP.LIST_TABLE] &&
		meta[TRANSFER30TO21COOP.LIST_TABLE].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFER30TO21COOP.billtype,
				billcodefield: TRANSFER30TO21COOP.vbillcode,
				pkfield: TRANSFER30TO21COOP.csaleorderid
			});
		});
	meta[TRANSFER30TO21COOP.VIEW] &&
		meta[TRANSFER30TO21COOP.VIEW].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFER30TO21COOP.billtype,
				billcodefield: TRANSFER30TO21COOP.vbillcode,
				pkfield: TRANSFER30TO21COOP.csaleorderid
			});
		});
	return meta;
}
