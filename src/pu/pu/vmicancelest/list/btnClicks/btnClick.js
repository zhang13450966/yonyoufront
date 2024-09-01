/*
 * @Author: zhangshqb 
 * @PageInfo: 按钮监听处理
 * @Date: 2018-06-07 10:13:29 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-28 15:18:57
 */
import { LIST_BUTTON } from '../../constance';
import { cancelestBtnClick, printBtnClick, linkQueryBtnClick, refreashBtnClick } from './index';
export default function btnClick(props, key) {
	if (key === LIST_BUTTON.cancelest) {
		cancelestBtnClick.bind(this, props)();
	} else if (key === LIST_BUTTON.print) {
		printBtnClick.bind(this, props)();
	} else if (key === LIST_BUTTON.linkQuery) {
		linkQueryBtnClick.bind(this, props)();
	} else if (key == LIST_BUTTON.refreash) {
		refreashBtnClick.call(this, props);
	}
}
