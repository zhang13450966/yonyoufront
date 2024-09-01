/*
 * @Author: 王龙华 
 * @PageInfo: 按钮处理
 * @Date: 2018-05-11 15:49:50 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-09-18 11:03:11
 */

import addBtnClick from './addBtnClick';
import editBtnClick from './editBtnClick';
import cancelBtnClick from './cancelBtnClick';
import saveBtnClick from './saveBtnClick';
import deleteBtnClick from './deleteBtnClick';
import print_BtnClick from './print_BtnClick';
import export_BtnClick from './export_BtnClick';
import refresh_BtnClick from './refresh_BtnClick';
import {  INVSOURCE_BUTTONS } from '../../const';

export default function onButtonClicks(props, btncode) {
	switch (btncode) {
		case INVSOURCE_BUTTONS.Add:
            addBtnClick.call(this, props);
			break;
		case INVSOURCE_BUTTONS.Edit:
			editBtnClick.call(this, props);
			break;
		case INVSOURCE_BUTTONS.Export:
			export_BtnClick.call(this, props);
			break;
		case INVSOURCE_BUTTONS.Cancel:
			cancelBtnClick.call(this,props)
			break;
		case INVSOURCE_BUTTONS.Save:
			saveBtnClick.call(this, props);
			break;
		case INVSOURCE_BUTTONS.Print:
			print_BtnClick.call(this, props);
			break;
		case INVSOURCE_BUTTONS.Refresh:
		    refresh_BtnClick.call(this, props);
			break;
		case INVSOURCE_BUTTONS.Delete:
	     	deleteBtnClick.call(this, props)
			break;
	}
}
