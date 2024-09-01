/*
 * @Author: liujia9 
 * @PageInfo: 反确认
 * @Date: 2019-04-17 11:06:24 
 * @Last Modified by: liujia9
 * @Last Modified time: 2019-04-18 09:48:26
 */
import { URL } from '../../constance';
import cardBodyBtnClick from './cardBodyBtnClick';

export default function(props) {
	cardBodyBtnClick.call(this, props, URL.UNCONFIRM);
}
