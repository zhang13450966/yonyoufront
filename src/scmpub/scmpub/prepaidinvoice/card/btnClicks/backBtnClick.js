/*
 * @Author: 刘奇 
 * @PageInfo: 卡片态返回按钮事件  
 * @Date: 2019-03-13 14:20:24 
 * @Last Modified by: 刘奇 
 * @Last Modified time: 2019-03-13 14:20:24 
 */

import { PREPAIDINVOICE_CONST } from '../../const';

export default function clickBackBtn(props) {
	this.props.linkTo(PREPAIDINVOICE_CONST.List_URL, {});
}
