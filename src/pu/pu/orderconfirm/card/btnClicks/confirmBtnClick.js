/*
 * @Author: liujia9 
 * @PageInfo: 确认
 * @Date: 2019-04-17 11:04:36 
 * @Last Modified by: liujia9
 * @Last Modified time: 2019-04-18 09:48:31
 */

import { URL } from '../../constance';
import cardBodyBtnClick from './cardBodyBtnClick';

export default function(props) {
	cardBodyBtnClick.call(this, props, URL.CONFIRM);
}
