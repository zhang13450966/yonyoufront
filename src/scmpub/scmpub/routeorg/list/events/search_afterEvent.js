/*
 * @Author: 王勇 
 * @PageInfo: 查询区参照过滤  
 * @Date: 2020-02-10 10:59:10 
 * @Last Modified by: wangpju
 * @Last Modified time: 2020-07-21 15:33:40
 */
import { ROUTEVOINFO, QUERYAREAINFO } from '../../const';
import multiCorpRefHandler from '../../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
export default function afterEvent(field, value) {
	// 参照只根据组织过滤的字段
	const pk_org_filter_Fields = [
		ROUTEVOINFO.cvehicleid, //车辆
		ROUTEVOINFO.ccarrierid //承运商
	];
	if (field === ROUTEVOINFO.pk_org) {
		multiCorpRefHandler.call(this, this.props, value, QUERYAREAINFO.areaCode, pk_org_filter_Fields);
	}
}
