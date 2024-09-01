/*
 * @Author: zhangchangqing 
 * @PageInfo: 查询按钮  
 * @Date: 2018-05-24 10:27:36 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-10-26 15:52:09
 */

import { STOREREQ_LIST } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import commonSerach from './commonSearch';
export default function clickSerachBtn(tabCode) {
	//this.search();
	
	//let pageInfo = this.props.table.getTablePageInfo(STOREREQ_LIST.formId); //分页信息
	let searchVal = this.props.search.getAllSearchData(STOREREQ_LIST.searchId); //必输项为空时，返回值为false
	if (!searchVal) {
		return;
	}
	// 将查询条件缓存
	this.setState({ searchVal: searchVal, searchFlag: true });
	// 查询
	commonSerach.bind(this, tabCode, searchVal, false, true)();
}
