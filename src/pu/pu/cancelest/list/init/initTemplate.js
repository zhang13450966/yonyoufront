/*
 * @Author: zhangshqb 
 * @PageInfo: 模板初始化
 * @Date: 2018-06-07 10:15:24 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-28 15:38:31
 */
import { PAGECODE, LIST_BUTTON, FIELD } from '../../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
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
				meta = modifier.call(this, meta, props);
				for (let key in meta.gridrelation) {
					meta.gridrelation[key].destEditAreaCode = key;
				}
				props.meta.setMeta(meta);
			}
			if (templedata.button) {
				let buttonArry = [
					LIST_BUTTON.print,
					LIST_BUTTON.linkQuery,
					LIST_BUTTON.cancelest,
					LIST_BUTTON.refreash
				];
				let button = templedata.button;
				props.button.setButtons(button);
				props.button.setButtonDisabled(buttonArry, true);
			}
		}
	}
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
	return meta;
}
