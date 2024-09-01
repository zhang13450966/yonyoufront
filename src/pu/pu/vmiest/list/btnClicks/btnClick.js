/*
 * @Author: zhangshqb
 * @PageInfo: 按钮监听处理
 * @Date: 2018-06-26 11:37:40
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-02-11 09:23:10
 */
import { LIST_BUTTON } from '../../constance';
import {
	estBtnClick,
	feeDistributeBtnClick,
	hqhpBtnClick,
	printBtnClick,
	linkQueryBtnClick,
	refreashBtnClick,
} from './index';
export default function btnClick(props, key) {
	if (key === LIST_BUTTON.est) {
		estBtnClick.bind(this, props)();
	} else if (key === LIST_BUTTON.hqhp) {
		hqhpBtnClick.bind(this, props)();
	} else if (key === LIST_BUTTON.feeDistribute) {
		feeDistributeBtnClick.bind(this, props)();
	} else if (key === LIST_BUTTON.print) {
		printBtnClick.bind(this, props)();
	} else if (key === LIST_BUTTON.linkQuery) {
		linkQueryBtnClick.bind(this, props)();
	} else if (key == LIST_BUTTON.refreash) {
		refreashBtnClick.call(this, props);
	}
}
