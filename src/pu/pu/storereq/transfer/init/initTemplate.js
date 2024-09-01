/*
 * @Author: mikey.zhangchqf
 * @Date: 2018-06-21 21:03:37 请购单拉单
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-06-30 14:41:32
 */

import { STOREREQ_LIST, ATTRCODE } from '../../siconst';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			appcode: STOREREQ_LIST.appcode,
			pagecode: STOREREQ_LIST.transferList //页面id
		},
		function(data) {
			if (data) {
				transtypeUtils.init.call(_this, data.context);
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(_this, _this.props, meta);
					props.meta.setMeta(meta);
					//将返回的pageid缓存里
					_this.setState({
						pageId: data.template.pageid
					});
				}

				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.context && data.context.paramMap) {
					//缓存交易类型,拉单使用
					setDefData(STOREREQ_LIST.dataSource, 'transtype', data.context.paramMap.transtype);
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
	meta[STOREREQ_LIST.tableId].items.map((item) => {
		// item.width = 120;
		return item;
	});

	meta[STOREREQ_LIST.searchId].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		//设置表头请购类型参照过滤 根据单据类型
		if (item.attrcode == 'pk_transitype') {
			item.queryCondition = () => {
				return { parentbilltype: '4D14' };
			};
		} else if (item.attrcode == 'pk_org') {
			//主组织过滤 项目组织
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'bodyvos.pk_stockorg') {
			//主组织过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (
			item.attrcode == 'bodyvos.pk_supplier_v' ||
			item.attrcode == 'bodyvos.pk_material' ||
			item.attrcode == 'bodyvos.pk_material.pk_marbasclass'
		) {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(STOREREQ_LIST.searchId, 'bodyvos.pk_stockorg');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'pk_project') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(STOREREQ_LIST.searchId, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'pk_req_maker' || item.attrcode == 'pk_req_dept') {
			//需求编制人、需求编制部门  过滤业务人员来源
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(STOREREQ_LIST.searchId, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, busifuncode: STOREREQ_LIST.xiangmu };
			};
		} else if (item.attrcode == 'auditor') {
			//审批人
			item.isShowUnit = false;
		} else if (item.attrcode == 'billmaker') {
			//制单人
			item.isShowUnit = false;
		} else {
			// //参照过滤 根据pk_org 过滤
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(STOREREQ_LIST.searchId, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	meta[STOREREQ_LIST.formId].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '4D14',
			pkfield: 'pk_mater_plan'
		});
	});
	meta[STOREREQ_LIST.VIEW].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '4D14',
			pkfield: 'pk_mater_plan'
		});
	});
	return meta;
}
