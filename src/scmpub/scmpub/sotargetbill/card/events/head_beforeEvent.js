/*
 * @PageInfo: 卡片表头编辑前事件 
 * @Author: gaoxq
 * @Last Modified by: &Last Modified by&
 * @Last Modified time: &Last Modified time&
 * @Date: 2019-04-04 10:10:07
 */

import { TARGETBILL_CONST, FIELD } from '../../const';
import SaleMarUtils from '../../../../refer/SaleMarterial/utls/SaleMarUtls';
let formId = TARGETBILL_CONST.formId;

export default function headBeforeEvent(props, moduleId, key, value, data) {
	let status = props.getUrlParam(TARGETBILL_CONST.status);
	//编辑态，主组织、指标表不可以修改
	if (key == FIELD.pk_org) {
		if (status && status == 'browse') {
			return true;
		} else {
			return false;
		}
	} else if (key == FIELD.ctargetid) {
		if (status && status == 'browse') {
			let pk_org = props.form.getFormItemsValue(formId, FIELD.pk_org).value;
			if (pk_org == undefined || pk_org == '') {
				return false;
			}
			return true;
		} else {
			return false;
		}
	} else if (key == FIELD.cmardimenid || key == FIELD.vperiod) {
		// 单据号
		let meta = props.meta.getMeta();
		//物料和期间过滤
		meta[TARGETBILL_CONST.formId].items.map((item) => {
			if (item.attrcode == key) {
				item.queryCondition = () => {
					let targetid = this.props.form.getFormItemsValue(formId, FIELD.ctargetid).value;
					return {
						TARGETID: targetid,
						targetid: targetid
					};
				};
			}
		});
		props.meta.setMeta(meta);
		if (key == FIELD.cmardimenid) {
			SaleMarUtils(props, this.ctargetvalue, formId, FIELD.cmardimenid);
		}
	}
	return true;
}
