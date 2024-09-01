/*
 * @Author: CongKe
 * @PageInfo: 采购订单拉采购合同初始化
 * @Date: 2018-06-13 14:12:29
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-04-04 13:02:12
 */
import { ajax, base } from 'nc-lightapp-front';
import { TRANSFER49 } from '../../constance';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';

export default function() {
	let _this = this;
	_this.props.createUIDom(
		{
			pagecode: TRANSFER49.PAGEID,
			appcode: TRANSFER49.appcode,
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(_this, _this.props, meta);
					_this.props.meta.setMeta(meta, () => {
						data.template.pageid &&
							_this.setState({
								templetid: data.template.pageid,
							});
					});
				}
				let button = [
					{
						id: 'Refresh_id',
						type: 'general_btn',
						key: TRANSFER49.Refresh,
						area: TRANSFER49.PAGEID,
						order: '1',
						children: [],
					},
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
	meta[TRANSFER49.SEARCHID].items.map(item => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		// item.width = 120;
		if (item.attrcode == 'pk_org') {
			// 库存组织多选
			item.isMultiSelectedEnabled = true;
		} else if (item.attrcode == 'cgeneralbid.cpurorgoid') {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode != 'pk_org' && item.attrcode != 'cwarehouseid') {
			item.isShowUnit = true;
			// 根据采购过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER49.SEARCHID, 'cgeneralbid.cpurorgoid');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
		if (item.attrcode == 'ctrantypeid') {
			//订单类型
			item.queryCondition = () => {
				return {
					parentbilltype: '49',
				};
			};
		} else if (item.attrcode == 'cbizid') {
			// 业务员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER49.SEARCHID, 'cgeneralbid.cpurorgoid');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(TRANSFER49.SEARCHID, 'cdptid');
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'pu',
				};
			};
		} else if (item.attrcode == 'cdptid') {
			// 部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER49.SEARCHID, 'cgeneralbid.cpurorgoid');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu',
				};
			};
		} else if (item.attrcode == 'cwarehouseid') {
			// 仓库 根据库存组织过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFER49.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'st',
					isdirectstore: 'N', //非直运
					gubflag: 'N',
				};
			};
		}
		return item;
	});
	// 拉单的超链接
	meta[TRANSFER49.LIST_TABLE] &&
		meta[TRANSFER49.LIST_TABLE].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFER49.billtype,
				billcodefield: TRANSFER49.vbillcode,
				pkfield: TRANSFER49.cgeneralhid,
			});
		});
	meta[TRANSFER49.VIEW] &&
		meta[TRANSFER49.VIEW].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFER49.billtype,
				billcodefield: TRANSFER49.vbillcode,
				pkfield: TRANSFER49.cgeneralhid,
			});
		});
	return meta;
}
