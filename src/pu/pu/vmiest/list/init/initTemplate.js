/*
 * @Author: zhangshqb 
 * @PageInfo: 模板加载  
 * @Date: 2018-05-26 11:32:35 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2021-07-10 14:14:29
 */
import { PAGECODE, LIST_BUTTON, FIELD } from '../../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { rateTypeSellFilter } from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.pagecode //模板pageid
		},
		callbackFun
	);
	function callbackFun(templedata) {
		if (templedata) {
			if (templedata.template) {
				let meta = templedata.template;
				for (let key in meta.gridrelation) {
					meta.gridrelation[key].destEditAreaCode = key;
				}
				meta = modifier(meta, props);
				props.meta.setMeta(meta);
			}
			if (templedata.button) {
				let button = templedata.button;
				let butArray = [
					LIST_BUTTON.est,
					LIST_BUTTON.feeDistribute,
					LIST_BUTTON.linkQuery,
					LIST_BUTTON.print,
					LIST_BUTTON.refreash
				];
				props.button.setButtons(button);
				props.button.setButtonDisabled(butArray, true);
			}
		}
	}
}

function modifier(meta, props) {
	//增行删行按钮取消了，这一版这几个按钮没有实际意义，所以咨询需求后去掉了
	meta[PAGECODE.searchId].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (item.attrcode == FIELD.pk_srcmaterial) {
			item.isShowUnit = true;
		}
		if (item.attrcode == FIELD.pk_material) {
			item.isShowUnit = true;
		}
		if (item.attrcode == FIELD.pk_supplier) {
			item.isShowUnit = true;
		}
		if (item.attrcode == FIELD.pk_financeorg) {
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		}
		if (item.attrcode == FIELD.transtype) {
			item.queryCondition = () => {
				return { parentbilltype: '50' }; // 根据pk_org过滤
			};
		} else if (item.attrcode == 'pk_stordoc') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_storeorg) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_storeorg).value.firstvalue
						: null;
				return { pk_org: data }; // 根据pk_org过滤
			};
		} else if (item.attrcode != FIELD.pk_storeorg && item.attrcode != FIELD.pk_financeorg) {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_financeorg) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_financeorg).value.firstvalue
						: null;
				return { pk_org: data }; // 根据pk_org过滤
			};
		}
	});
	meta[PAGECODE.childTableId].items.map((item) => {
		if (item.attrcode == FIELD.cratetype) {
			// 组织汇率类型
			item.queryCondition = () => {
				return rateTypeSellFilter.call(this);
			};
		} else {
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_financeorg) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_financeorg).value.firstvalue
						: null;
				return { pk_org: data }; // 根据pk_org过滤
			};
		}
	});
	meta[PAGECODE.modaltablecode].items.map((item) => {
		if (item.attrcode == FIELD.cratetype) {
			// 组织汇率类型
			item.queryCondition = () => {
				return rateTypeSellFilter.call(this);
			};
		} else {
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_financeorg) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_financeorg).value.firstvalue
						: null;
				return { pk_org: data }; // 根据pk_org过滤
			};
		}
	});
	meta[PAGECODE.tableId].items.map((item) => {
		if (item.attrcode == FIELD.cratetype) {
			// 组织汇率类型
			item.queryCondition = () => {
				return rateTypeSellFilter.call(this);
			};
		}
	});
	return meta;
}
