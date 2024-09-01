/*
 * @Author: zhaochyu
 * @PageInfo: 期初暂估单转单列表
 * @Date: 2018-06-19 10:36:18
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-09-12 15:29:33
 */
import { URL, PAGECODE, SEARCH_FIELD, AREA, DATASOURCE, FIELD } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.transferlist, //页面id
			appcode: PAGECODE.poorder, //应用编码
			//appid: TRANSFER.appid //注册按钮的id
		},
		data => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					//交易类型引用
					transtypeUtils.init.call(this, data.context);
					modifierMeta(this.props, meta);
					this.props.meta.setMeta(meta, () => {
						setDefData(DATASOURCE.transferdataSource, FIELD.templetid, data.template.pageid);
					});
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	);
}
function getFieldValue2Arr(props, code) {
	let data = props.search.getSearchValByField(AREA.searchArea, code);
	data = ((data && data.value && data.value.firstvalue) || '').split(',');
	let length = data.length;
	if (length > 1) {
		return {};
	}
	return data;
}
/**
 * 自定义元数据样式
 * @param {*} props
 * @param {*} meta
 */
function modifierMeta(props, meta) {
	// 设置固定宽度 撑开子表
	meta[AREA.cardTableArea].items.map(item => {
		// item.width = 120;
		return item;
	});

	meta[AREA.searchArea].items.map(item => {
		let code = item.attrcode;
		item.col = 4;
		// item.width = 120;
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (
			code == SEARCH_FIELD.pk_srcmaterialorder ||
			code == SEARCH_FIELD.pk_supplier ||
			code == SEARCH_FIELD.pk_srcmaterialcode ||
			code == SEARCH_FIELD.pk_srcmaterialname ||
			code == SEARCH_FIELD.pk_marbasclassorder ||
			code == SEARCH_FIELD.casscustidorder
		) {
			item.isShowUnit = true;
			item.isMultiSelectedEnabled = true;
			item.queryCondition = () => {
				let data = getFieldValue2Arr(props, SEARCH_FIELD.pk_psfinanceorg);
				return { pk_org: data[0] };
			};
		} else if (code == SEARCH_FIELD.pk_psfinanceorg) {
			item.queryCondition = () => {
				return { TreeRefActionExt: URL.org_permissions };
			};
		} else if (code == SEARCH_FIELD.ctrantypeid) {
			item.isShowUnit = true;
			item.isMultiSelectedEnabled = true;
			item.queryCondition = () => {
				let data = getFieldValue2Arr(props, SEARCH_FIELD.pk_psfinanceorg);
				return {
					parentbilltype: '21',
					SCM_CONSIDERBUSITYPE: 'Y',
					SCM_BUSIORG: data[0],
				};
			};
		} else if (code == SEARCH_FIELD.billmaker || code == SEARCH_FIELD.approver) {
			item.isMultiSelectedEnabled = true;
		}
	});
	meta[AREA.cardFormArea].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '21',
			pkfield: 'pk_order',
		});
	});
	meta[AREA.VIEW].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '21',
			pkfield: 'pk_order',
		});
	});
	return meta;
}
