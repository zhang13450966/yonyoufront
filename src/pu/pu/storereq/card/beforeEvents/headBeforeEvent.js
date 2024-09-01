/*
 * @Author: zhangchangqing 
 * @PageInfo:   表头编辑前事件 单据号编辑前事件，这类方法必须有返回值，返回true为可编辑，false为不可编辑
 * @Date: 2018-05-03 14:54:12 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2018-12-24 16:51:18
 */

import { ajax, base, toast } from 'nc-lightapp-front';
import { STOREREQ_CARD, ATTRCODE, FBILLSTATUS } from '../../siconst';
import vbillcodeBeforeEvent from './vbillcodeBeforeEvent';
import { transtypeUtils, crossRuleUtils } from '../../../../../scmpub/scmpub/pub/tool';
let formId = STOREREQ_CARD.formId;
export default async function(props, moduleId, key, value, data) {
	let flag = true;
	if (key == ATTRCODE.vbillcode) {
		flag = await vbillcodeBeforeEvent.call(this, props, moduleId, key, value, data);
	} else if (key == ATTRCODE.ctrantypeid) {
		let fbillstatus = this.props.form.getFormItemsValue(formId, ATTRCODE.fbillstatus).value;
		if (fbillstatus == FBILLSTATUS.approve) {
			//审批中的单子，不允许修改
			//flag = false;
			return false;
		}
		//交易类型发布的节点，交易类型不可编辑
		flag = transtypeUtils.beforeEdit.call(this, key, ATTRCODE.ctrantypeid, ATTRCODE.vtrantypecode);
		let ctrantypeid = props.form.getFormItemsValue(formId, ATTRCODE.ctrantypeid);
		if (
			!flag &&
			(props.cardTable.getAllRows(tableId).length > 0 &&
				props.cardTable.getAllRows(tableId)[0].values.csourcebillbid) &&
			(ctrantypeid && ctrantypeid.value)
		) {
			flag = false;
		}
	} else if (ATTRCODE.noEditfield.includes(key)) {
		flag = false;
	}
	let record = null;
	let crossRuleParams = {
		props,
		key, //当前字段
		appcode: null, //小应用编码，如果是本应用，可为空
		pagecode: STOREREQ_CARD.cardpageid, //页面编码
		headarea: formId, //表头区域编码
		bodyarea: STOREREQ_CARD.tableId, //表体区域编码
		isHead: true, //是否为表头区字段
		record, //当前表体行数据，如果是表头触发，可以为空
		pk_org_field: STOREREQ_CARD.pk_org, //组织字段，注意为oid
		billtype: '422X', //单据类型
		transtypeid_field: ATTRCODE.ctrantypeid //交易类型id字段
	};
	crossRuleUtils.beforeEdit.call(this, crossRuleParams);
	return flag;
}
