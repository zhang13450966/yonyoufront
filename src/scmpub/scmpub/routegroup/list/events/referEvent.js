/*
 * @Author: 王勇 
 * @PageInfo: 查询区设置isShowUnit=true  
 * @Date: 2020-02-09 17:16:19 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-03-04 18:12:13
 */
import {ROUTEVOINFO,QUERYAREAINFO}  from '../../const/index';

// 查询区设置isShowUnit=true 的字段
const set_showUnit_Fields = [ ROUTEVOINFO.cvehicleid, ROUTEVOINFO.ccarrierid];

export default function referEvent(props, meta) {
	
	queryReferEvent.call(this,props, meta);
	
}

function queryReferEvent(props, meta) {
	meta[QUERYAREAINFO.areaCode].items.map((item) => {
        if (set_showUnit_Fields.includes(item.attrcode)) {
            item.isShowUnit = true;
		}
	});
}
