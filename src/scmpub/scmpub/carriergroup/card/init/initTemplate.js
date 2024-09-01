/*
 * @Author: zhaochyu
 * @PageInfo: 承运商定义-物流组织
 * @Date: 2020-02-17 15:13:19
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-19 15:33:06
 */
import { PAGEID, HEADFILED, AREA, ALLBUTTONS, BROWSEBUTTONS } from '../../constance';
import pageInfoClick from '../btnClick/pageInfoClick';
export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGEID.cardpagecodegroup
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
					pageInfoClick.call(this, this.props);
				}
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
		}
	});
	return meta;
}
