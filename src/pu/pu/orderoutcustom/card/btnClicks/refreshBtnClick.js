/*
 * @Author: liujia9 
 * @PageInfo: 刷新 
 * @Date: 2019-04-16 14:22:20 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-05-27 19:23:58
 */
import pageInfoClick from '../btnClicks/pageInfoClick';

export default function(props) {
	pageInfoClick.call(this, props, props.getUrlParam('id'), true, true);
}
