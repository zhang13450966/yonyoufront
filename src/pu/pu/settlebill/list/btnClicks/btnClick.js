import {
	delBtnClick,
	cancelToIABtnClick,
	sendToIABtnClick,
	printBtnClick,
	linkQuery,
	fileClick,
	refreashBtnClick,
	outputBtnClick,
} from './index';
import { BUTTON } from '../../constance';
export default function(props, key) {
	if (key === BUTTON.del) {
		//删除
		delBtnClick.bind(this, props)();
	} else if (key === BUTTON.cancelToIA) {
		//取消传存货
		cancelToIABtnClick.bind(this, props)();
	} else if (key === BUTTON.sendToIA) {
		//传存货
		sendToIABtnClick.bind(this, props)();
	} else if (key === BUTTON.linkQuery) {
		//单据追溯
		linkQuery.bind(this, props)();
	} else if (key === BUTTON.print) {
		printBtnClick.bind(this, props)();
	} else if (key === BUTTON.file) {
		fileClick.bind(this, props)();
	} else if (key == BUTTON.refreash) {
		refreashBtnClick.call(this, props, true);
	} else if (key == BUTTON.output) {
		outputBtnClick.call(this, props);
	}
}
