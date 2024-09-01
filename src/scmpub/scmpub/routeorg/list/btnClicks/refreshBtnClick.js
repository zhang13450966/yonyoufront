/*
 * @Author: 王勇 
 * @PageInfo: 列表-运输路线刷新  
 * @Date: 2020-01-17 09:51:03 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-02-28 19:07:54
 */
import searchBtnClick from './searchBtnClick';

export default function refresh_BtnClick(props) {
	searchBtnClick.call(this, 2, props, this.oldSearchVal);

}