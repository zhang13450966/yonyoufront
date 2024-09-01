/*
 * @Author: 刘奇 
 * @PageInfo: 查询编辑后事件
 * @Date: 2019-03-21 10:22:16 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-08-20 20:43:16
 */

import { REF30_CONST, FIELD } from '../const';
import multiCorpRefHandler from '../../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { getDefFieldArray } from '../../../pub/tool/getDefFieldArrayTool';

export default function afterEvent(field, value) {
	if (field === FIELD.csettleorgid) {
		//依赖财务组织
		let csettleorgid_filter_Fields = [ FIELD.ccustomerid, FIELD.cmaterialid, FIELD.cmaterialid_code ]
			.concat(getDefFieldArray('vdef', 20))
			.concat(getDefFieldArray('so_saleorder_b.vfree', 10))
			.concat(getDefFieldArray('so_saleorder_b.vbdef', 20));
		multiCorpRefHandler.call(this, this.props, value, REF30_CONST.searchId, csettleorgid_filter_Fields);
	} else if (field === FIELD.pk_org) {
		//依赖财务组织
		let pkorg_filter_Fields = [ FIELD.cemployeeid, FIELD.cdeptid ];
		multiCorpRefHandler.call(this, this.props, value, REF30_CONST.searchId, pkorg_filter_Fields);
	}
}
