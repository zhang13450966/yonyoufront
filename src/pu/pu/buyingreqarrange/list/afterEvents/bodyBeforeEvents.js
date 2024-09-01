/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-06-30 09:56:24
 */
import { BUYINGREQ_CARD, ATTRCODES, ATTRCODE, BUYINGREQ_LIST } from '../../siconst';
let formId = BUYINGREQ_LIST.formId;
export default function bodyBeforeEvents(props, moduleId, item, index, value, record) {
	let _this = this;
	let _props = props;
	let _index = index;
	let meta = this.props.meta.getMeta();
	let key = item.attrcode;
	//设置单位过滤
	if (key == ATTRCODES.pk_purchaseorg_v) {
		meta[formId].items.map((item) => {
			if (item.attrcode == ATTRCODES.pk_purchaseorg) {
				//采购组织不需要根据库存组织过滤
				item.queryCondition = () => {
					return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
				};
			}
		});
		props.meta.setMeta(meta);
		return true;
	}
	if (key == ATTRCODES.pk_employee || key == ATTRCODES.pk_suggestsupplier_v) {
		// 采购组织为空不允许编辑
		let pk_purchaseorg = props.editTable.getValByKeyAndIndex(moduleId, index, ATTRCODES.pk_purchaseorg).value;
		if (pk_purchaseorg) {
			meta[formId].items.map((item) => {
				if (item.attrcode == ATTRCODES.pk_employee) {
					//采购员 根据采购组织 过滤 业务人员来源
					//item.isShowUnit = true;
					let data = props.editTable.getValByKeyAndIndex(moduleId, index, ATTRCODES.pk_purchaseorg);
					data = data != null ? (data.value.includes(',') ? null : data.value) : null;
					item.queryCondition = () => {
						return { pk_org: data, busifuncode: BUYINGREQ_LIST.purchaseorg };
					};
				} else if (item.attrcode == ATTRCODES.pk_suggestsupplier_v) {
					let pk_purchaseorg = props.editTable.getValByKeyAndIndex(moduleId, index, ATTRCODES.pk_purchaseorg)
						.value;
					item.queryCondition = () => {
						return {
							pk_org: pk_purchaseorg
						};
					};
				}
			});
			props.meta.setMeta(meta);
			return true;
		}
		return false;
	}
	return false;
}
