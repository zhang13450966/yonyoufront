/*
 * @Author: xiahui 
 * @PageInfo: 发货
 * @Date: 2019-04-17 11:04:36 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-04-17 16:14:58
 */

import { URL } from '../../constance';
import cardBodyBtnClick from './cardBodyBtnClick';

export default function(props) {
	cardBodyBtnClick.call(this, props, URL.sendout);
}
