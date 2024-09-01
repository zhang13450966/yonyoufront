/*
 * @Author: 王龙华 
 * @PageInfo: 刷新按钮点击事件 
 * @Date: 2019-01-08 09:14:12 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-07-24 09:49:37
 */
import searchBtnClick from './searchBtnClick';

export default function refresh_BtnClick(props) {
	searchBtnClick.call(this, 2, props, this.oldSearchVal);
}
