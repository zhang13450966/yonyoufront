/*
 * @Author: 刘奇 
 * @PageInfo: 查询编辑后事件
 * @Date: 2019-03-21 10:22:16 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-08-20 20:42:33
 */

import { ajax } from 'nc-lightapp-front';
import { REF4621_CONST, FIELD } from '../const';
import multiCorpRefHandler from '../../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { getDefFieldArray } from '../../../pub/tool/getDefFieldArrayTool';

export default function afterEvent(field, value) {
	if (field === FIELD.csettleorgid) {
		//财务组织
		let fields = [
			FIELD.cinvoicecustid,
			FIELD.cinvoicecustid_pk_custclass,
			FIELD.cordercustid,
			FIELD.cordercustid_pk_custclass
		]
			.concat(getDefFieldArray('vdef', 20))
			.concat(getDefFieldArray('pk_settle_b.vbdef', 20));

		multiCorpRefHandler.call(this, this.props, value, REF4621_CONST.searchId, fields);
	} else if (field === FIELD.pk_org) {
		multiCorpRefHandler.call(this, this.props, value, REF4621_CONST.searchId, [ 'cwarehouseid', 'cwhsmanagerid' ]);
	}
}
