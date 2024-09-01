/*
 * @Author: liujia9 
 * @PageInfo: 刷新 
 * @Date: 2019-04-16 14:22:20 
 * @Last Modified by: liujia9 
 * @Last Modified time: 2019-04-16 14:22:20 
 */
import pageInfoClick from '../btnClicks/pageInfoClick';

export default function(props) {
	pageInfoClick.call(this, props, props.getUrlParam('id'), true, true);
}
