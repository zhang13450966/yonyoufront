/*
 * @Author: 王勇 
 * @PageInfo: 列表组织切换  
 * @Date: 2020-03-24 14:33:06 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2020-07-23 20:10:25
 */
import {ROUTEVOINFO,QUERYAREAINFO}  from '../../const/index';

export default function OrgChangeBtnClick(props,record){
	// 参照只根据组织过滤的字段
	const pk_org_filter_Fields = [
        ROUTEVOINFO.cvehicleid,  //车辆
        ROUTEVOINFO.ccarrierid,  //承运商
    ];
	let refpk = record.refpk;
	let refvalue = record.refname;
	this.setState({
		refpk: refpk,
		refvalue: refvalue,
	});

	let meta = props.meta.getMeta();

	meta[QUERYAREAINFO.areaCode].items.forEach((item) => {

		if (pk_org_filter_Fields.includes(item.attrcode)) {
			item.isShowUnit = false;
			item.queryCondition = () => {
				return { pk_trafficorg: refpk};
			};
		}
	});
}