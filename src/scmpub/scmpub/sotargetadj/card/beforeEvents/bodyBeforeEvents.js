/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: wangpju
 * @Last Modified time: 2022-04-14 09:50:07
 */
import { TARGETADJ_CARD, ATTRCODES, ATTRCODE } from '../../siconst';
export default async function bodyBeforeEvents(props, moduleId, key, value, index, record) {
	let flag = true;
	let meta = this.props.meta.getMeta();
	//客户
	if (key == ATTRCODES.ccustomerid) {
		//主组织没值，不允许编辑
		let pk_org = props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.pk_org);
		let ctargetid = props.form.getFormItemsValue(TARGETADJ_CARD.headf, ATTRCODE.ctargetid);
		if (pk_org && pk_org.value && ctargetid && ctargetid.value) {
			flag = true;
			meta[moduleId].items.map((item) => {
				//主组织过滤客户
				if (item.attrcode == ATTRCODES.ccustomerid) {
					props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								pk_org: pk_org.value
							};
						}
					});
				}
			});
		} else {
			flag = false;
		}
	} else if (key.indexOf('changenew') != -1) {
		if (moduleId == TARGETADJ_CARD.tableOldId) {
			flag = false;
		}
	}
	return flag;
}
