/*
 * @Author: zhangchangqing 
 * @PageInfo:   表头编辑前事件 单据号编辑前事件，这类方法必须有返回值，返回true为可编辑，false为不可编辑
 * @Date: 2018-05-03 14:54:12 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2018-12-21 09:26:05
 */

import { crossRuleUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { BUYINGREQ_CARD, ATTRCODE, ATTRCODES } from '../../siconst';
let tableId = BUYINGREQ_CARD.tableId;
export default async function(props, moduleId, key, value, data) {
	
	let flag = true;
	// if (key == ATTRCODE.vbillcode) {
	// 	let flag = await vbillcodeBeforeEvent.call(this, props, moduleId, key, value, data);
	// 	return flag;
	// } else
	if (key == ATTRCODE.bsctype) {
		let rows = props.cardTable.getAllRows(tableId);
		flag = false;
		for (let i = 0; i < rows.length; i++) {
			let csourceid = props.cardTable.getValByKeyAndIndex(tableId, i, ATTRCODES.csourceid);
			if (csourceid) {
				flag = true;
			}
		}
	} else if (key == ATTRCODE.ctrantypeid) {
		//请购类型不允许修订
		flag = false;
	}
	let record = null;
	let crossRuleParams = {
		props,
		key, //当前字段
		appcode: null, //小应用编码，如果是本应用，可为空
		pagecode: BUYINGREQ_CARD.cardpageid, //页面编码
		headarea: BUYINGREQ_CARD.formId, //表头区域编码
		bodyarea: BUYINGREQ_CARD.tableId, //表体区域编码
		isHead: true, //是否为表头区字段
		record, //当前表体行数据，如果是表头触发，可以为空
		pk_org_field: BUYINGREQ_CARD.pk_org, //组织字段，注意为oid
		billtype: '20', //单据类型
		transtypeid_field: ATTRCODE.ctrantypeid //交易类型id字段
	};
	crossRuleUtils.beforeEdit.call(this, crossRuleParams);
	return flag;
}
