/*
 * @Author: 刘奇 
 * @PageInfo: 列表行按钮控制  
 * @Date: 2018-05-30 21:48:00 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-01-08 16:53:46
 */
import { deleteRow_BtnClick } from './index.js';
import { BUTTON } from '../constance';
import toggle_BtnClick from './toggle_BtnClick.js';
export default function onBody_BtnClick(props, key, record, index) {
	switch (key) {
		case BUTTON.deleteLine:
			deleteRow_BtnClick.call(this, props, record, index);
			break;
		case BUTTON.startUse:
			// if (record.values.bseal) {
			record.values.bseal.value = 'N';
			// }else{

			// }
			toggle_BtnClick.call(this, props, record, index);
			break;
		case BUTTON.stopUse:
			// if (record.values.bseal) {
			record.values.bseal.value = 'Y';
			// }
			toggle_BtnClick.call(this, props, record, index);
			break;
	}
}
