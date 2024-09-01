/*
 * @Author: zhangchangqing 
 * @PageInfo: 查询按钮  
 * @Date: 2018-05-24 10:27:36 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-04 16:37:47
 */

import { BUYINGREQ_LIST } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import commonSerach from './commonSearch';
export default function clickSerachBtn(tabCode) {
	let searchVal = this.props.search.getAllSearchData(BUYINGREQ_LIST.searchId); //必输项为空时，返回值为false
	if (!searchVal) {
		return;
	}
	// 将查询条件缓存
	this.setState({
		searchVal: searchVal,
		searchFlag: true
	});
	// 查询
	commonSerach.bind(this, tabCode, searchVal)();
}
