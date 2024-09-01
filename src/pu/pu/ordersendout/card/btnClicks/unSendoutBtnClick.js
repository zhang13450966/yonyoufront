/*
 * @Author: xiahui 
 * @PageInfo: 反发货
 * @Date: 2019-04-17 11:06:24 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-04-17 16:14:59
 */
import { URL } from '../../constance';
import cardBodyBtnClick from './cardBodyBtnClick';

export default function(props) {
	cardBodyBtnClick.call(this, props, URL.unSendout);
}
