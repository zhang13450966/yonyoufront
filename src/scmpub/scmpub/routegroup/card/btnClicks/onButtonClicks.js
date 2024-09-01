/*
 * @Author: 王勇 
 * @PageInfo: 卡片-按钮点击绑定  
 * @Date: 2020-01-17 09:39:31 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-01 13:08:25
 */
import { CARDBUTTONINFO } from '../../const/index';
import innerDelLineBtnClick from './innerDelLineBtnClick';
import innerAddLineBtnClick from './innerAddLineBtnClick';
import innerInsLineBtnClick from './innerInsLineBtnClick';
import saveBtnClick from './saveBtnClick';
import cancleBtnClick from './cancleBtnClick';
import delBtnClick from './delBtnClick';
import printBtnClick from './printBtnClick';
import outputBtnClick from './outputBtnClick';
import editBtnClick from './editBtnClick';
import addBtnClick from './addBtnClick';
import refreshBtnClick from './refreshBtnClick';
import backBtnClick from './backBtnClick';
import copyBtnClick from './copyBtnClick';
import enableBtnClick from './enableBtnClick';
import disableBtnClick from './disableBtnClick';
import batchDelLineBtnClick from './batchDelLineBtnClick';
export default function onButtonClicks(props, btnCode, record, index) {
	switch (btnCode) {
		case CARDBUTTONINFO.innerDelLineBtnCode:
			innerDelLineBtnClick.call(this, props, index);
			break;
		case CARDBUTTONINFO.innerAddLineBtnCode:
			innerAddLineBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.delLineBtnCode:
			batchDelLineBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.innerInsLineBtnCode:
			innerInsLineBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.saveBtnCode:
			saveBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.cancelBtnCode:
			cancleBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.delBtnCode:
			delBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.printBtnCode:
			printBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.outputBtnCode:
			outputBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.editBtnCode:
			editBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.addBtnCode:
			addBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.refreshBtnCode:
			refreshBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.backBtnCode:
			backBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.copyBtnCode:
			copyBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.enableBtnCode:
			enableBtnClick.call(this, props);
			break;
		case CARDBUTTONINFO.disableBtnCode:
			disableBtnClick.call(this, props);
			break;
	}
}
