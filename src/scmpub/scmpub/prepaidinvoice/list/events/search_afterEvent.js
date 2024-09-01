/*
 * @Author: wangceb
 * @PageInfo: 销售订单查询编辑后事件 
 * @Date: 2018-04-24 10:38:43 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-08-05 17:20:04
 */

import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';
import multiCorpRefHandler from '../../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { getDefFieldArray } from '../../../pub/tool/getDefFieldArrayTool';

export default function afterEvent(field, value) {
	// 参照只根据财务组织过滤的字段
	const pk_org_filter_Fields = [ PrepaidinvoiceHeadItem.capcustid, PrepaidinvoiceHeadItem.ctakefeeid ]
		.concat(getDefFieldArray('vdef', 20))
		.concat(getDefFieldArray('b.vbdef', 20));
	if (field === PrepaidinvoiceHeadItem.pk_org) {
		multiCorpRefHandler.call(this, this.props, value, PREPAIDINVOICE_CONST.searchId, pk_org_filter_Fields);
	}
}
