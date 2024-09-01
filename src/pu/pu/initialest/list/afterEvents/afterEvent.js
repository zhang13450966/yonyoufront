/*
 * @Author: zhaochyu 
 * @PageInfo: 列表编辑后事件
 * @Date: 2018-07-27 17:30:19 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:01:25
 */
import { SEARCH_FIELD, PAGECODE, AREA } from '../../constance';
import multiCorpRefHandler from '../../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
export default function afterEvent(field, val) {
	if (field == SEARCH_FIELD.pk_org) {
		multiCorpRefHandler(this.props, val, PAGECODE.searchId, [
			SEARCH_FIELD.pk_srcmaterial,
			SEARCH_FIELD.pk_supplier,
			SEARCH_FIELD.pk_srcmaterial,
			SEARCH_FIELD.pk_srcmaterialCode,
			SEARCH_FIELD.pk_srcmaterialName,
			SEARCH_FIELD.pk_marbasclass,
			SEARCH_FIELD.casscustid
		]);
	} else if (field == SEARCH_FIELD.pk_stockorg) {
		multiCorpRefHandler(this.props, val, PAGECODE.searchId, [ SEARCH_FIELD.pk_stordoc ]);
	} else if (field == SEARCH_FIELD.pk_psfinanceorg) {
		multiCorpRefHandler(this.props, val, AREA.searchArea, [
			SEARCH_FIELD.pk_srcmaterialorder,
			SEARCH_FIELD.pk_supplier,
			SEARCH_FIELD.pk_srcmaterialcode,
			SEARCH_FIELD.pk_srcmaterialname,
			SEARCH_FIELD.pk_marbasclassorder,
			SEARCH_FIELD.casscustidorder
		]);
	}
}
