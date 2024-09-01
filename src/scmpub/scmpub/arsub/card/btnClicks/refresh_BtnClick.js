/*
 * @Author: 刘奇 
 * @PageInfo: 卡片刷新按钮点击事件
 * @Date: 2019-03-18 16:03:11 
 * @Last Modified by: 刘奇 
 * @Last Modified time: 2019-03-18 16:03:11 
 */

import commonSearch_BtnClick from './commonSearch_BtnClick';
import { BUTTON } from '../../const';

export default function buttonClick(props) {
	let carsubid = this.props.getUrlParam('id');
	commonSearch_BtnClick.call(this, this.props, carsubid, BUTTON.refresh);
}
