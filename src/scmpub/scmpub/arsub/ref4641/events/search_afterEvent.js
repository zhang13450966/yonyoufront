/*
 * @Author: 刘奇 
 * @PageInfo: 查询编辑后事件
 * @Date: 2019-03-21 10:22:16 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-08-20 20:41:49
 */

import { ajax } from 'nc-lightapp-front';
import { REF4641_CONST, FIELD } from '../const';
import multiCorpRefHandler from '../../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { getDefFieldArray } from '../../../pub/tool/getDefFieldArrayTool';

//依赖销售组织
const pkorg_filter_Fields = [ FIELD.cdeptid, FIELD.cpsnid ];
//依赖财务组织
const csettleorgid_filter_Fields = [ FIELD.cfeecustomerid ]
	.concat(getDefFieldArray('vdef', 20))
	.concat(getDefFieldArray('cbill_bid.vbdef', 20));
export default function afterEvent(field, value) {
	if (field === FIELD.cfinanceorgid) {
		multiCorpRefHandler.call(this, this.props, value, REF4641_CONST.searchId, csettleorgid_filter_Fields);
	} else if (field === FIELD.pk_org) {
		multiCorpRefHandler.call(this, this.props, value, REF4641_CONST.searchId, pkorg_filter_Fields);
	}
}
