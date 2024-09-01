/*
 * @Author: zhangchangqing 
 * @PageInfo: 查询按钮  
 * @Date: 2018-05-24 10:27:36 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 10:17:41
 */

import { TARGET_LIST } from '../../siconst';
import commonSerach from './commonSearch';
export default function clickSerachBtn(tabCode) {
	let searchVal = this.props.search.getAllSearchData(TARGET_LIST.searchId); //必输项为空时，返回值为false
	if (!searchVal) {
		return;
	}
	// 将查询条件缓存
	this.setState({ searchVal: searchVal, searchFlag: true });
	// 查询
	commonSerach.bind(this, tabCode, searchVal)();
}
