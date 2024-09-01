/*
 * @Author: liujia9 
 * @PageInfo: 反报关
 * @Date: 2019-04-17 11:06:24 
 * @Last Modified by: liujia9
 * @Last Modified time: 2019-05-10 15:51:00
 */
import { URL } from '../../constance';
import cardBodyBtnClick from './cardBodyBtnClick';

export default function(props) {
	cardBodyBtnClick.call(this, props, URL.unCustom);
}
