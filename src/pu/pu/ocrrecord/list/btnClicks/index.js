/*
 * @Author: zhangbfk 
 * @PageInfo: 按钮点击事件  
 * @Date: 2018-04-24 14:53:24 
 * @Last Modified by: zhangbfk
 * @Last Modified time: 2019-04-16 10:44:35
 */

import deleteBtnClick from './deleteBtnClick';
import { BUTTONID } from '../../constance';
import searchBtnClick from './searchBtnClick';

function btnClick(props, key, text, record, index) {
	switch (key) {
		case BUTTONID.Delete:
			deleteBtnClick.call(this, props, text, record, index);
			break;
	}
}

export { btnClick, searchBtnClick };
