/*
 * @Author: 刘奇 
 * @PageInfo: 查询编辑后事件
 * @Date: 2019-03-21 10:22:16 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2020-06-19 10:30:49
 */

import { REF4804_CONST, FIELD } from '../const';
import multiCorpRefHandler from '../../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';

export default function afterEvent(field, value) {
	if (field === FIELD.pk_org) {
		let fields = [
			FIELD.crouteid,
			FIELD.ccarrierid,
			FIELD.capcustid,
			FIELD.ccosignid,
			FIELD.ctakefeeid,
			FIELD.cprojectid
		];
		multiCorpRefHandler.call(this, this.props, value, REF4804_CONST.searchId, fields);
	}
}
