/*
 * @Author: 刘奇 
 * @PageInfo: 卡片操作列按钮事件
 * @Date: 2019-03-18 16:37:49 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-18 16:42:13
 */

import {
	spread_BtnClick,
	deleteLine_BtnClick,
	copyLine_BtnClick,
	insertLine_BtnClick,
	pasteLine_BtnClick
} from './index';
import { BUTTON } from '../../const';

export default function buttonClick(props, id, text, record, index) {
	switch (id) {
		// 展开
		case BUTTON.spread:
			return spread_BtnClick.call(this, props, record, index);
			break;
		// 删行
		case BUTTON.deleteLine:
			return deleteLine_BtnClick.call(this, props, record, index);
			break;
		// 复制行
		case BUTTON.copyLine:
			return copyLine_BtnClick.call(this, props, record, index);
			break;
		// 插入行
		case BUTTON.insertLine:
			return insertLine_BtnClick.call(this, props, record, index);
			break;
		// 粘贴行
		case BUTTON.pasteLine:
			return pasteLine_BtnClick.call(this, props, record, index);
			break;
		default:
			break;
	}
}
