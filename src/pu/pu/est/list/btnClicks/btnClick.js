/*
 * @Author: zhangshqb
 * @PageInfo: 按钮处理
 * @Date: 2018-05-26 11:03:03
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-04-23 09:58:22
 */
import { LIST_BUTTON } from '../../constance';
import {
	estBtnClick,
	feeDistributeBtnClick,
	hqhpBtnClick,
	printBtnClick,
	linkQueryBtnClick,
	refreahBtnClick,
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
	} else if (key === LIST_BUTTON.linkquery) {
		linkQueryBtnClick.call(this, props);
	} else if (key == LIST_BUTTON.refreash) {
		refreahBtnClick.call(this, props);
	}
}
