/*
 * @Author: CongKe
 * @PageInfo: 采购订单拉采购合同初始化
 * @Date: 2018-06-13 14:12:29
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-09-12 15:33:40
 */
import { ajax, base } from 'nc-lightapp-front';
import { TRANSFERZ2 } from '../../constance';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';

export default function() {
	let _this = this;
	_this.props.createUIDom(
		{
			pagecode: TRANSFERZ2.PAGEID,
			appcode: TRANSFERZ2.appcode,
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
						key: TRANSFERZ2.Refresh,
						area: TRANSFERZ2.PAGEID,
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
	meta[TRANSFERZ2.SEARCHID].items.map(item => {
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
		// item.width = 120;
		if (item.attrcode == 'pk_org') {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		}
		if (item.attrcode != 'pk_org') {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFERZ2.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
		if (item.attrcode == 'ctrantypeid') {
			//订单类型
			item.queryCondition = () => {
				return {
					parentbilltype: 'Z2',
				};
			};
		} else if (item.attrcode == 'personnelid') {
			// 计划员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFERZ2.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_dept = props.search.getSearchValByField(TRANSFERZ2.SEARCHID, 'depid');
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_org: data,
					pk_dept: pk_dept,
					busifuncode: 'pu',
				};
			};
		} else if (item.attrcode == 'depid') {
			// 部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TRANSFERZ2.SEARCHID, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: 'pu',
				};
			};
		}
		return item;
	});
	// 拉单的超链接
	meta[TRANSFERZ2.LIST_TABLE] &&
		meta[TRANSFERZ2.LIST_TABLE].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFERZ2.billtype,
				billcodefield: TRANSFERZ2.vbillcode,
				pkfield: TRANSFERZ2.pk_ct_pu,
			});
		});
	meta[TRANSFERZ2.VIEW] &&
		meta[TRANSFERZ2.VIEW].items.map((item, index) => {
			transferSkipToSrcBillUtil.call(this, this.props, item, {
				billtype: TRANSFERZ2.billtype,
				billcodefield: TRANSFERZ2.vbillcode,
				pkfield: TRANSFERZ2.pk_ct_pu,
			});
		});
	return meta;
}
