/*
 * @Author: mikey.zhangchqf
 * @Date: 2018-06-21 21:03:37 请购单拉单
 * @Last Modified by: zhr
 * @Last Modified time: 2022-05-17 18:47:52
 */

import { ajax, base } from 'nc-lightapp-front';
import { APPCODE, FIELD, PAGECODE, COMMON, AREA } from '../../constance';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
let { NCPopconfirm } = base;
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			appcode: APPCODE.settle,
			pagecode: PAGECODE.ref55E6_list //页面id
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
					setDefData(COMMON.PuinvoiceCacheKey, 'transtype', data.context.paramMap.transtype);
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
	//----------------------参照过滤自行补充-----------------------------------------------------------

	meta[AREA.search55E6].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (item.attrcode == 'pk_org') {
			//工厂，计划组织
			item['queryCondition'] = () => {
				return {
					//权限过滤
					GridRefActionExt: 'nccloud.web.mmpub.pub.ref.AppPermissionOrgRefFilter'
				};
			};
		} else if (item.attrcode == 'pk_org_v') {
			//设置可多选
			item.isMultiSelectedEnabled = true;
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.mmpub.pub.ref.AppPermissionOrgVidRefFilter' };
			};
		} else if (item.attrcode == 'pk_settle_b.cbpmaterialvid' || item.attrcode == 'pk_settle_b.cbpmaterialid') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.search55E6, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? '' : data.value.firstvalue) : '';
				return {
					pk_org: data,
					GridRefActionExt: 'nccloud.web.mmpub.pub.ref.MaterialSqlRefBuilder'
				};
			};
		} else if (
			item.attrcode == 'pk_supplier' ||
			item.attrcode == 'pk_supplier_v' ||
			item.attrcode == 'pk_settle_b.cpvendorid' ||
			item.attrcode == 'pk_settle_b.cpvendorvid' ||
			item.attrcode == 'pk_settle_b.cvendorid' ||
			item.attrcode == 'pk_settle_b.cvendorvid'
		) {
			item.isShowUnit = true;
			//加工品供应商、材料供应商
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.search55E6, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (
			item.attrcode == 'pk_settle_b.cpcustomerid' ||
			item.attrcode == 'pk_settle_b.cpcustomervid' ||
			item.attrcode == 'pk_settle_b.ccustomerid' ||
			item.attrcode == 'pk_settle_b.ccustomervid'
		) {
			item.isShowUnit = true;
			//加工品客户、材料客户
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.search55E6, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'cdeptid' || item.attrcode == 'cdeptvid') {
			item.isShowUnit = true;
			//部门
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.search55E6, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, busifuncode: 'fa' };
			};
		} else if (item.attrcode == 'cemployeeid') {
			item.isShowUnit = true;
			//业务员
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.search55E6, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
		return item;
	});
	meta[AREA.head55E6].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '55E6',
			pkfield: 'pk_settle'
		});
	});
	meta[AREA.view55E6].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '55E6',
			pkfield: 'pk_settle'
		});
	});
	return meta;
}
