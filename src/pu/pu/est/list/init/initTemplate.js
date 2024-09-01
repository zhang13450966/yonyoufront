/*
 * @Author: zhangshqb
 * @PageInfo: 初始化模板
 * @Date: 2018-04-26 11:26:48
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-04-24 17:36:09
 */
import { PAGECODE, FIELD, LIST_BUTTON } from '../../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { rateTypeSellFilter } from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.pagecode //模板pageid
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					let meta = templedata.template;
					meta = modifier.call(this, meta, props);
					props.meta.setMeta(meta);
				}
				if (templedata.button) {
					let button = templedata.button;
					let butArray = [
						LIST_BUTTON.est,
						LIST_BUTTON.feeDistribute,
						LIST_BUTTON.hqhp,
						LIST_BUTTON.linkquery,
						LIST_BUTTON.print,
						LIST_BUTTON.refreash
					];
					setTimeout(() => {
						props.button.setButtons(button);
					}, 0);
					props.button.setButtonDisabled(butArray, true);
				}
			}
		}
	);
}

function modifier(meta, props) {
	for (let key in meta.gridrelation) {
		meta.gridrelation[key].destEditAreaCode = key;
	}
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

		if (item.attrcode == FIELD.pk_org) {
			item.isShowUnit = false;
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		}
		if (item.attrcode == FIELD.transtype) {
			item.queryCondition = () => {
				return { parentbilltype: '45' }; // 根据pk_org过滤
			};
		} else if (item.attrcode == 'pk_psndoc') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_stockorg) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_stockorg).value.firstvalue
						: null;

				return { pk_org: data, busifuncode: 'pu' }; // 根据pk_org过滤
			};
		} else if (item.attrcode == 'pk_dept') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_stockorg) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_stockorg).value.firstvalue
						: null;
				return { pk_org: data, busifuncode: 'pu' }; // 根据pk_org过滤
			};
		} else if (item.attrcode == 'pk_stordoc') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_stockorg) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_stockorg).value.firstvalue
						: null;
				return { pk_org: data }; // 根据pk_org过滤
			};
		} else if (
			item.attrcode != FIELD.pk_stockorg &&
			item.attrcode != 'billmaker' &&
			item.attrcode != FIELD.pk_org
		) {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org).value.firstvalue
						: null;
				return { pk_org: data }; // 根据pk_org过滤
			};
		}
	});
	meta[PAGECODE.childTableId].items.map((item) => {
		// 记录必输项，用于暂估时校验必输项  begin
		if (item.required) {
			this.po_stockps_fee_mustCol.push(item.attrcode);
			this.map.set(item.attrcode, item.label);
		}
		// 记录必输项，用于暂估时校验必输项  end
		if (item.attrcode == FIELD.cratetype) {
			// 组织汇率类型
			item.queryCondition = () => {
				return rateTypeSellFilter.call(this);
			};
		} else {
			item.queryCondition = () => {
				let data =
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org).value.firstvalue
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
					props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org) != null
						? props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org).value.firstvalue
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
