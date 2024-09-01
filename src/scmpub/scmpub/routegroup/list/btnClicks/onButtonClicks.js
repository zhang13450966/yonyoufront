/*
 * @Author: 王勇 
 * @PageInfo: 列表-按钮绑定  
 * @Date: 2020-01-17 09:49:39 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:07:43
 */

import { BUTTONINFO } from '../../const/index';
import addBtnClick from './addBtnClick';
import refreshBtnClick from './refreshBtnClick';
import delBtnClick from './delBtnClick';
import printBtnClick from './printBtnClick';
import outputClick from './outputClick';
import pageInfoBtnClick from './pageInfoBtnClick';
import innerDoubleClick from './innerDoubleClick';
import showOffBtnClick from './showOffBtnClick';
import AttachmentManageClick from './AttachmentManageClick';
export default function onButtonClicks(props, btnCode, record, index) {
	switch (btnCode) {
		case BUTTONINFO.addBtnCode:
			addBtnClick.call(this, props);
			break;
		case BUTTONINFO.refreshBtnCode:
			refreshBtnClick.call(this, props);
			break;
		case BUTTONINFO.delBtnCode:
			delBtnClick.call(this, props);
			break;
		case BUTTONINFO.printBtnCode:
			printBtnClick.call(this, props);
			break;
		case BUTTONINFO.outputBtnCode:
			outputClick.call(this, props);
			break;
		case BUTTONINFO.pageinfoBtnCode:
			pageInfoBtnClick.call(this, props);
			break;
		case BUTTONINFO.doubleClickBtnCode:
			innerDoubleClick.call(this, props, record, index);
			break;
		case BUTTONINFO.showOffBtnCode:
			showOffBtnClick.call(this, props);
			break;
		case BUTTONINFO.attachmentManageBtnCode:
			AttachmentManageClick.call(this, props);
			break;
	}
}
