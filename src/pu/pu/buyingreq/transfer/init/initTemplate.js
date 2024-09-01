/*
 * @Author: mikey.zhangchqf
 * @Date: 2018-06-21 21:03:37 请购单拉单
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-09-12 15:28:55
 */

import { ajax, base } from 'nc-lightapp-front';
import { BUYINGREQ_LIST, ATTRCODE, BUYINGREQ_CARD } from '../../siconst';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
let { NCPopconfirm } = base;
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			appcode: BUYINGREQ_LIST.appcode,
			pagecode: BUYINGREQ_LIST.transferList, //页面id
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
						pageId: data.template.pageid,
					});
				}

				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.context && data.context.paramMap) {
					//缓存交易类型,拉单使用
					setDefData(BUYINGREQ_LIST.dataSource, 'transtype', data.context.paramMap.transtype);
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
	meta[BUYINGREQ_LIST.tableId].items.map(item => {
		// item.width = 120;
		return item;
	});

	meta[BUYINGREQ_LIST.searchId].items.map(item => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		//设置表头请购类型参照过滤 根据单据类型
		if (item.attrcode == ATTRCODE.ctrantypeid) {
			item.queryCondition = () => {
				return { parentbilltype: '422X' };
			};
		} else if (item.attrcode == ATTRCODE.pk_org) {
			//主组织过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'approver') {
			item.queryCondition = () => {
				//用户档案的人，不需要显示业务单元
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, BUYINGREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'billmaker') {
			item.queryCondition = () => {
				//用户档案的人，不需要显示业务单元
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, BUYINGREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == ATTRCODE.pk_appdepth || item.attrcode == ATTRCODE.pk_appdepth_v) {
			item.isShowUnit = true;
			//申请部门 按照组织过滤 支持业务人员来源
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, BUYINGREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return {
					pk_org: data,
					busifuncode: BUYINGREQ_LIST.storereq,
				};
			};
		} else if (item.attrcode == ATTRCODE.pk_apppsnh) {
			item.isShowUnit = true;
			//申请人 按照组织过滤 支持业务人员来源
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, BUYINGREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_appdepth = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, ATTRCODE.pk_appdepth);
				pk_appdepth =
					pk_appdepth != null
						? pk_appdepth.value.firstvalue.includes(',')
							? null
							: pk_appdepth.value.firstvalue
						: null;
				return { pk_org: data, pk_dept: pk_appdepth, busifuncode: BUYINGREQ_LIST.storereq };
			};
		} else {
			//参照过滤 根据pk_org 过滤
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, BUYINGREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	meta[BUYINGREQ_LIST.formId].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '422X',
			pkfield: 'pk_storereq',
		});
	});
	meta[BUYINGREQ_LIST.VIEW].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '422X',
			pkfield: 'pk_storereq',
		});
	});
	return meta;
}
