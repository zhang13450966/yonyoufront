/*
 * @Author: zhangchangqing 
 * @PageInfo: 查询按钮  
 * @Date: 2018-05-24 10:27:36 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-02-25 13:26:35
 */

import { TARGETADJ_LIST } from '../../siconst';
import commonSerach from './commonSearch';
export default function clickSerachBtn(tabCode) {
	let searchVal = this.props.search.getAllSearchData(TARGETADJ_LIST.searchId); //必输项为空时，返回值为false
	if (!searchVal) {
		return;
	}
	// 将查询条件缓存
	this.setState({ searchVal: searchVal, searchFlag: true });
	// 查询
	commonSerach.bind(this, tabCode, searchVal, false, true)();
}
