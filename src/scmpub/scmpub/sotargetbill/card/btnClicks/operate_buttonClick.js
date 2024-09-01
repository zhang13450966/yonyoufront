/*
 * @PageInfo:  卡片操作列按钮事件 
 * @Author: gaoxq
 * @Last Modified by: &Last Modified by&
 * @Last Modified time: &Last Modified time&
 * @Date: 2019-04-10 18:44:24
 */

import deleteLine_BtnClick from './deleteLine_BtnClick';
import insertLine_BtnClick from './insertLine_BtnClick';
import addRow_BtnClick from './addRow_BtnClick';
import { BUTTONS } from '../../const';

export default function buttonClick(props, id, text, record, index) {
	switch (id) {
		//增行 AddLine
		case BUTTONS.ADDLINE:
			return addRow_BtnClick.bind(this)(props, record, index);
			break;

		// DeleteLine	删行
		case BUTTONS.DELETELINE:
			return deleteLine_BtnClick.bind(this)(props, record, index);
			break;

		// InsertLine	插入行
		case BUTTONS.INSERTLINE:
			return insertLine_BtnClick.bind(this)(props, record, index);
			break;
	}
}
