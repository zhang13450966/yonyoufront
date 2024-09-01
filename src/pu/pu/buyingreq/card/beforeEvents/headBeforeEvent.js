/*
 * @Author: zhangchangqing 
 * @PageInfo:   表头编辑前事件 单据号编辑前事件，这类方法必须有返回值，返回true为可编辑，false为不可编辑
 * @Date: 2018-05-03 14:54:12 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-03-17 11:27:59
 */

import { BUYINGREQ_CARD, ATTRCODE, ATTRCODES, FBILLSTATUS } from '../../siconst';
import vbillcodeBeforeEvent from './vbillcodeBeforeEvent';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { transtypeUtils, crossRuleUtils } from '../../../../../scmpub/scmpub/pub/tool';
let tableId = BUYINGREQ_CARD.tableId;
export default async function(props, moduleId, key, value, data) {
	let flag = true;
	if (key == ATTRCODE.vbillcode) {
		flag = await vbillcodeBeforeEvent.call(this, props, moduleId, key, value, data);
	} else if (key == ATTRCODE.bsctype) {
		//当表体有来源单据信息时，委外不允许勾选；直运生成的请购单不允许和委外同事勾选
		// 2020-6-10 根据李皓楠需求优化条目，此限制放开
		let rows = props.cardTable.getAllRows(tableId);
		for (let i = 0; i < rows.length; i++) {
			let csourcetypecode = props.cardTable.getValByKeyAndIndex(tableId, i, ATTRCODES.csourcetypecode).value;
			if (csourcetypecode == '55B4' || csourcetypecode == '55A2' || csourcetypecode == '55C2') {
				return false;
			}
		}
		//直运
		let bdirecttransit = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.bdirecttransit).value;
		if (bdirecttransit) {
			showWarningInfo(null, getLangByResId(this, '4004PRAYBILL-000064')); /* 直运和委外互斥，不能同时选择。*/
			return false;
		}
	} else if (key == ATTRCODE.ctrantypeid) {
		let fbillstatus = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.fbillstatus).value;
		if (fbillstatus == FBILLSTATUS.approve) {
			//审批中的单子，不允许修改
			//flag = false;
			return false;
		}
		//交易类型发布的节点，交易类型不可编辑
		flag = transtypeUtils.beforeEdit.call(this, key, ATTRCODE.ctrantypeid, ATTRCODE.vtrantypecode);
		let ctrantypeid = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.ctrantypeid);
		if (
			!flag &&
			(props.cardTable.getAllRows(tableId).length > 0 &&
				props.cardTable.getAllRows(tableId)[0].values.csourcebillbid) &&
			(ctrantypeid && ctrantypeid.value)
		) {
			flag = false;
		}
	} else if (ATTRCODE.otherfields.includes(key)) {
		// 不允许编辑字段
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
