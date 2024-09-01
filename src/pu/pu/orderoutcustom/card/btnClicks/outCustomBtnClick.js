/*
 * @Author: liujia9 
 * @PageInfo: 出关
 * @Date: 2019-04-17 11:04:36 
 * @Last Modified by: liujia9
 * @Last Modified time: 2019-05-10 15:47:17
 */

import { URL } from '../../constance';
import cardBodyBtnClick from './cardBodyBtnClick';

export default function(props) {
	cardBodyBtnClick.call(this, props, URL.custom);
}
