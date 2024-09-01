/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-05-03 20:28:55
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-03-25 11:21:37
 */
import { BUTTON, URL } from '../../constance';
import {
	delBtnClick,
	sendToIABtnClick,
	pageInfoClick,
	linkQuery,
	fileClick,
	printBtnClick,
	outputBtnClick,
} from '../btnClicks/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props, key, text, record, index) {
	switch (key) {
		case BUTTON.del: //删除
			delBtnClick.call(this, props);
			break;
		case BUTTON.cancelToIA: //取消传存货
			/* 国际化处理： 取消传成本成功！*/
			sendToIABtnClick.call(this, props, URL.cancelToIA, getLangByResId(this, '4004SETTLEBILL-000000'));
			break;
		case BUTTON.sendToIA: //传存货
			/* 国际化处理： 传成本成功！*/
			sendToIABtnClick.call(this, props, URL.sendToIA, getLangByResId(this, '4004SETTLEBILL-000005'));
			break;
		case BUTTON.file: //附件
			fileClick.call(this, props);
			break;
		case BUTTON.linkQuery: //单据联查
			linkQuery.call(this, props);
			break;
		case BUTTON.print: //打印
			printBtnClick.call(this, props);
			break;
		case BUTTON.refreash: //刷新
			/* 国际化处理： 刷新成功！*/
			pageInfoClick.call(this, props, null, getLangByResId(this, '4004SETTLEBILL-000004'));
			break;
		case BUTTON.output: //输出
			outputBtnClick.call(this, props);
			break;
		default:
			break;
	}
}
