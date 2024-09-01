/*
 * @Author: zhaochyu
 * @PageInfo: 承运商定义-物流组织
 * @Date: 2020-02-17 15:13:19
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-30 16:32:45
 */
import { PAGEID, HEADFILED, AREA, FILED, ALLBUTTONS, BROWSEBUTTONS, CARRIERDATASOURCE } from '../../constance';
import pageInfoClick from '../btnClick/pageInfoClick';
import { setDefData } from '../../../pub/cache';
export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGEID.cardpagecodeorg
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setButtonVisible(ALLBUTTONS, false);
					props.button.setButtonVisible(BROWSEBUTTONS, true);
				}
				if (data.context && data.context.pk_org) {
					let pk_org_v = { value: data.context.pk_org_v, display: data.context.org_v_Name };
					let pk_org = { value: data.context.pk_org, display: data.context.org_Name };
					setDefData(CARRIERDATASOURCE.carrierdatasource, FILED.org, pk_org_v);
					setDefData(CARRIERDATASOURCE.carrierdatasource, FILED.pk_org, pk_org);
				}
				pageInfoClick.call(this, this.props);
			}
		}
	);
}

//增加操作列
function modifierMeta(props, meta) {
	meta[AREA.card_head].items.forEach((item) => {
		if (item.attrcode == HEADFILED.csupplierid) {
			//按组织过滤
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(AREA.card_head, HEADFILED.pk_org).value;
				let returnData = {};
				if (pk_org) {
					returnData.pk_org = pk_org;
				}
				returnData.GridRefActionExt = 'nccloud.web.scmpub.ref.SupplierRefFilter';
				return returnData;
			};
		} else if (item.attrcode == HEADFILED.pk_org_v) {
			item.queryCondition = () => {
				item.isHasDisabledData = false;
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
			};
		} else if (item.attrcode == HEADFILED.csendtypeid) {
			//按组织过滤
			item.queryCondition = () => {
				let pk_org = this.props.form.getFormItemsValue(AREA.card_head, HEADFILED.pk_org).value;
				let returnData = {};
				if (pk_org) {
					returnData.pk_org = pk_org;
				}
				return returnData;
			};
		} else if (item.attrcode.startsWith('vdef') && item.itemtype == 'refer') {
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(AREA.card_head, HEADFILED.pk_org) || {}).value;
				return { pk_org: pk_org };
			};
		}
	});
	return meta;
}
