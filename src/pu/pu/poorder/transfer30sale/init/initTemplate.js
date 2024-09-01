/*
 * @Author: CongKe
 * @PageInfo: 采购订单拉直运销售订单初始化
 * @Date: 2018-06-13 14:12:29
 * @Last Modified by: zhr
 * @Last Modified time: 2021-10-18 14:23:40
 */
import { ajax, base } from 'nc-lightapp-front';
import { TRANSFER30TO21 } from '../../constance';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';

export default function() {
	let _this = this;
	let scene = _this.props.getUrlParam('scene');
	let appcode = '';
	if (scene == 'Y') {
		appcode = '400400818';
	} else {
		appcode = TRANSFER30TO21.appcode;
	}
	_this.props.createUIDom(
		{
			pagecode: TRANSFER30TO21.PAGEID,
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
						key: TRANSFER30TO21.Refresh,
						area: TRANSFER30TO21.PAGEID,
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
	meta[TRANSFER30TO21.SEARCHID].items.map((item) => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		// item.width = 120;
		if (item.attrcode == 'dest_pk_org') {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		}
		if (item.attrcode != 'pk_org' && item.attrcode != 'dest_pk_org') {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30TO21.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
		if (item.attrcode == 'ctrantypeid') {
			//订单类型
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30TO21.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					// billtype: '30',
					parentbilltype: '30',
					GridRefActionExt: 'nccloud.web.pu.order.ref.TransTypeRefFilter'
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
		} else if (item.attrcode == 'cemployeeid') {
			// 计划员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER30TO21.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(TRANSFER30TO21.SEARCHID, 'cdeptid');
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
				let data = props.search.getSearchValByField(TRANSFER30TO21.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'st'
				};
			};
		}
		return item;
	});
	// 拉单的超链接
	meta[TRANSFER30TO21.LIST_TABLE] &&
		meta[TRANSFER30TO21.LIST_TABLE].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFER30TO21.billtype,
				billcodefield: TRANSFER30TO21.vbillcode,
				pkfield: TRANSFER30TO21.csaleorderid
			});
		});
	meta[TRANSFER30TO21.VIEW] &&
		meta[TRANSFER30TO21.VIEW].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFER30TO21.billtype,
				billcodefield: TRANSFER30TO21.vbillcode,
				pkfield: TRANSFER30TO21.csaleorderid
			});
		});
	return meta;
}
